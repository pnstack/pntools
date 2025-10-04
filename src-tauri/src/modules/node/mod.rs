use std::fs;
use std::fs::{File, OpenOptions};
use std::io::{Read, Write};
use std::process::{Child, Command, Stdio};
pub struct PythonServer {
    process: Option<Child>,
}

impl PythonServer {
    pub fn new() -> Self {
        PythonServer { process: None }
    }

    pub fn start(&mut self) {
        let home_dir = dirs::home_dir().unwrap();
        let python_path = home_dir
            .join(".pntools")
            .join("tools")
            .join("venv")
            .join("bin")
            .join("python3");

        let script_path = home_dir.join(".pntools").join("tools").join("app.py");

        println!("Path to python server: {:?}", script_path);
        let pid_file_path = home_dir.join(".pntools").join("python_server.pid");

        // Check if the PID file exists and kill the existing process if it does
        if pid_file_path.exists() {
            let mut pid_file = File::open(&pid_file_path).expect("failed to open PID file");
            let mut pid_str = String::new();
            pid_file
                .read_to_string(&mut pid_str)
                .expect("failed to read PID file");
            if let Ok(pid) = pid_str.trim().parse::<u32>() {
                if let Ok(mut existing_process) =
                    Command::new("kill").arg("-9").arg(pid.to_string()).spawn()
                {
                    existing_process
                        .wait()
                        .expect("failed to kill existing python server");
                    println!("Killed existing python server with PID: {}", pid);
                }
            }
            fs::remove_file(&pid_file_path).expect("failed to remove PID file");
        }

        // Open the log file in append mode
        let log_file = OpenOptions::new()
            .create(true)
            .append(true)
            .open(home_dir.join(".pntools").join("python_server.log"))
            .expect("failed to open log file");

        let process = Command::new(python_path)
            .arg(script_path)
            .stdout(Stdio::from(
                log_file
                    .try_clone()
                    .expect("failed to clone log file handle"),
            ))
            // .stderr(Stdio::from(log_file))
            .spawn()
            .expect("failed to start python server");

        // Save the PID to a file
        let pid = process.id();
        println!("run pid {}", pid);
        let pid_file_path = home_dir.join(".pntools").join("python_server.pid");
        let mut pid_file = File::create(pid_file_path).expect("failed to create PID file");
        writeln!(pid_file, "{}", pid).expect("failed to write PID to file");

        self.process = Some(process);
        println!("Python server started.");
    }

    pub fn stop(&mut self) {
        if let Some(mut process) = self.process.take() {
            process.kill().expect("failed to kill python server");
            println!("Python server stopped.");
        }
    }
}
