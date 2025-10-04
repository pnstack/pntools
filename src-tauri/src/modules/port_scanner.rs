use serde::{Deserialize, Serialize};
use std::net::TcpStream;
use std::process::Command;
use std::time::Duration;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PortScanResult {
    pub port: u16,
    pub is_open: bool,
    pub service: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ScanOptions {
    pub host: String,
    pub start_port: u16,
    pub end_port: u16,
    pub use_nmap: bool,
    pub timeout_ms: u64,
}

/// Scan a single port using native TCP connection
pub fn scan_port_native(host: &str, port: u16, timeout_ms: u64) -> PortScanResult {
    let addr = format!("{}:{}", host, port);
    let timeout = Duration::from_millis(timeout_ms);
    
    let is_open = TcpStream::connect_timeout(
        &addr.parse().unwrap_or_else(|_| {
            format!("127.0.0.1:{}", port).parse().unwrap()
        }),
        timeout,
    )
    .is_ok();

    PortScanResult {
        port,
        is_open,
        service: if is_open { get_service_name(port) } else { None },
    }
}

/// Get common service name for a port
fn get_service_name(port: u16) -> Option<String> {
    let service = match port {
        20 => "FTP Data",
        21 => "FTP",
        22 => "SSH",
        23 => "Telnet",
        25 => "SMTP",
        53 => "DNS",
        80 => "HTTP",
        110 => "POP3",
        143 => "IMAP",
        443 => "HTTPS",
        445 => "SMB",
        3306 => "MySQL",
        3389 => "RDP",
        5432 => "PostgreSQL",
        5900 => "VNC",
        6379 => "Redis",
        8080 => "HTTP-Alt",
        8443 => "HTTPS-Alt",
        27017 => "MongoDB",
        _ => return None,
    };
    Some(service.to_string())
}

/// Scan ports using native TCP method
pub fn scan_ports_native(options: &ScanOptions) -> Vec<PortScanResult> {
    let mut results = Vec::new();
    
    for port in options.start_port..=options.end_port {
        let result = scan_port_native(&options.host, port, options.timeout_ms);
        results.push(result);
    }
    
    results
}

/// Scan ports using nmap command
pub fn scan_ports_nmap(options: &ScanOptions) -> Result<Vec<PortScanResult>, String> {
    let port_range = if options.start_port == options.end_port {
        format!("{}", options.start_port)
    } else {
        format!("{}-{}", options.start_port, options.end_port)
    };

    let output = Command::new("nmap")
        .arg("-p")
        .arg(&port_range)
        .arg(&options.host)
        .output();

    match output {
        Ok(output) => {
            let stdout = String::from_utf8_lossy(&output.stdout);
            parse_nmap_output(&stdout, options.start_port, options.end_port)
        }
        Err(e) => Err(format!("Failed to execute nmap: {}. Make sure nmap is installed.", e)),
    }
}

/// Parse nmap output
fn parse_nmap_output(output: &str, start_port: u16, end_port: u16) -> Result<Vec<PortScanResult>, String> {
    let mut results = Vec::new();
    
    for line in output.lines() {
        if line.contains("/tcp") || line.contains("/udp") {
            let parts: Vec<&str> = line.split_whitespace().collect();
            if parts.len() >= 2 {
                if let Some(port_str) = parts[0].split('/').next() {
                    if let Ok(port) = port_str.parse::<u16>() {
                        let is_open = parts[1].contains("open");
                        let service = if parts.len() >= 3 {
                            Some(parts[2].to_string())
                        } else {
                            get_service_name(port)
                        };
                        
                        results.push(PortScanResult {
                            port,
                            is_open,
                            service,
                        });
                    }
                }
            }
        }
    }
    
    // If nmap didn't return results for all ports, fill in the gaps
    if results.is_empty() {
        for port in start_port..=end_port {
            results.push(PortScanResult {
                port,
                is_open: false,
                service: None,
            });
        }
    }
    
    Ok(results)
}

/// Main scan function that chooses between native and nmap
pub fn scan_ports(options: ScanOptions) -> Result<Vec<PortScanResult>, String> {
    if options.use_nmap {
        scan_ports_nmap(&options)
    } else {
        Ok(scan_ports_native(&options))
    }
}
