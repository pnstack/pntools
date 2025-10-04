# Port Explorer Module

A powerful port scanning tool integrated into PNTools that allows you to scan ports on your local machine or remote IP addresses.

## Features

- **Native Port Scanning**: Fast TCP connection-based port scanning built with Rust
- **Nmap Integration**: Optional use of nmap for more advanced scanning (when nmap is installed)
- **Flexible Configuration**:
  - Custom host/IP address targeting
  - Configurable port range (1-65535)
  - Adjustable timeout settings
  - Toggle between native and nmap scanning methods
- **Service Detection**: Automatically identifies common services on open ports
- **Interactive Results Table**:
  - Sortable columns
  - Filterable by status (open/closed)
  - Shows port number, status, and associated service

## Usage

1. Navigate to `Tauri > PortExplorer` in the application menu
2. Configure your scan:
   - **Target Host/IP**: Enter the hostname or IP address to scan (default: 127.0.0.1)
   - **Port Range**: Set the start and end ports to scan
   - **Timeout**: Adjust the connection timeout in milliseconds (default: 1000ms)
   - **Use nmap**: Toggle to use nmap instead of native scanning (requires nmap installation)
3. Click "Start Scan" to begin
4. View results in the table below, showing all scanned ports with their status

## Scanning Methods

### Native Scanning
- Uses Rust's TCP connection capabilities
- Fast for small port ranges
- No external dependencies required
- Works on all platforms

### Nmap Scanning
- Requires nmap to be installed on your system
- More accurate service detection
- Better for scanning large port ranges
- Advanced scanning capabilities

To use nmap scanning:
- **Linux/macOS**: Install via package manager (`sudo apt install nmap` or `brew install nmap`)
- **Windows**: Download from [nmap.org](https://nmap.org/download.html)

## Common Ports

The module recognizes common service ports including:
- 21: FTP
- 22: SSH
- 80: HTTP
- 443: HTTPS
- 3306: MySQL
- 5432: PostgreSQL
- 6379: Redis
- 8080: HTTP-Alt
- 27017: MongoDB

And many more...

## Security Note

Port scanning should only be performed on networks and systems you own or have explicit permission to scan. Unauthorized port scanning may be illegal in some jurisdictions.
