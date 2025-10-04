use crate::modules::port_scanner::{scan_ports, PortScanResult, ScanOptions};

#[tauri::command]
pub fn scan_ports_command(
    host: String,
    start_port: u16,
    end_port: u16,
    use_nmap: bool,
    timeout_ms: u64,
) -> Result<Vec<PortScanResult>, String> {
    let options = ScanOptions {
        host,
        start_port,
        end_port,
        use_nmap,
        timeout_ms,
    };
    
    scan_ports(options)
}

#[tauri::command]
pub fn check_nmap_available() -> bool {
    std::process::Command::new("nmap")
        .arg("--version")
        .output()
        .is_ok()
}
