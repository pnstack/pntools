# Port Explorer Implementation Summary

## Overview
This document describes the implementation of the Port Explorer module for PNTools, which provides port scanning capabilities with both native TCP scanning and optional nmap integration.

## Architecture

### Backend (Rust/Tauri)
Located in `src-tauri/src/`:

1. **modules/port_scanner.rs** - Core port scanning logic
   - Native TCP-based port scanning using Rust's standard library
   - Nmap integration for advanced scanning
   - Service name detection for common ports
   - Configurable timeout and port range support

2. **commands/port_scanner.rs** - Tauri command handlers
   - `scan_ports_command`: Main scanning function exposed to frontend
   - `check_nmap_available`: Check if nmap is installed on the system

### Frontend (React/TypeScript)
Located in `src/modules/tauri/components/port-explorer/`:

1. **index.tsx** - Main React component
   - User interface for configuring and running port scans
   - Interactive results table with filtering and sorting
   - Real-time scanning status and progress
   - Error handling and nmap availability detection

## Features Implemented

### 1. Native Port Scanning
- Uses Rust's `TcpStream::connect_timeout` for fast, reliable port checking
- No external dependencies required
- Cross-platform support (Windows, macOS, Linux)
- Configurable timeout per port

### 2. Nmap Integration
- Optional use of nmap for more advanced scanning
- Automatic detection of nmap availability
- Parses nmap output for enhanced service detection
- Fallback to native scanning if nmap fails

### 3. Service Detection
Common services automatically detected:
- FTP (20, 21)
- SSH (22)
- Telnet (23)
- SMTP (25)
- DNS (53)
- HTTP (80, 8080)
- HTTPS (443, 8443)
- SMB (445)
- MySQL (3306)
- RDP (3389)
- PostgreSQL (5432)
- VNC (5900)
- Redis (6379)
- MongoDB (27017)

### 4. User Interface
- Clean, intuitive design using Ant Design components
- Real-time scan progress indication
- Results displayed in sortable, filterable table
- Visual status indicators (green/red tags for open/closed ports)
- Summary statistics showing open vs. scanned ports

## API Reference

### Rust Commands

#### `scan_ports_command`
```rust
fn scan_ports_command(
    host: String,
    start_port: u16,
    end_port: u16,
    use_nmap: bool,
    timeout_ms: u64,
) -> Result<Vec<PortScanResult>, String>
```

**Parameters:**
- `host`: Target hostname or IP address
- `start_port`: First port in range to scan (1-65535)
- `end_port`: Last port in range to scan (1-65535)
- `use_nmap`: If true, use nmap; if false, use native scanning
- `timeout_ms`: Connection timeout in milliseconds

**Returns:** List of port scan results or error message

#### `check_nmap_available`
```rust
fn check_nmap_available() -> bool
```

**Returns:** `true` if nmap is installed and accessible, `false` otherwise

### Data Structures

#### PortScanResult
```rust
struct PortScanResult {
    port: u16,           // Port number
    is_open: bool,       // Whether port is open
    service: Option<String>, // Detected service name
}
```

## Usage Example

### From the UI:
1. Launch PNTools application
2. Navigate to: **Tauri > PortExplorer**
3. Configure scan parameters:
   - Host: `127.0.0.1` (or any IP/hostname)
   - Start Port: `1`
   - End Port: `1024`
   - Timeout: `1000` ms
   - Use nmap: Toggle on/off
4. Click "Start Scan"
5. View results in the table

### From Code (TypeScript):
```typescript
import { invoke } from '@tauri-apps/api/core';

// Scan ports 80-443 on localhost
const results = await invoke('scan_ports_command', {
  host: '127.0.0.1',
  startPort: 80,
  endPort: 443,
  useNmap: false,
  timeoutMs: 1000,
});

// Check if nmap is available
const nmapAvailable = await invoke('check_nmap_available');
```

## File Changes

### New Files Created:
1. `src-tauri/src/modules/port_scanner.rs` - Port scanning logic
2. `src-tauri/src/commands/port_scanner.rs` - Tauri command handlers
3. `src/modules/tauri/components/port-explorer/index.tsx` - React UI component
4. `src/modules/tauri/components/port-explorer/README.md` - Module documentation

### Modified Files:
1. `src-tauri/src/modules/mod.rs` - Added port_scanner module
2. `src-tauri/src/commands/mod.rs` - Added port_scanner commands
3. `src-tauri/src/main.rs` - Registered new Tauri commands
4. `src/modules/tauri/index.tsx` - Added PortExplorer route
5. `README.md` - Added feature documentation

## Security Considerations

1. **Authorization**: Port scanning should only be performed on networks/systems you own or have explicit permission to scan
2. **Rate Limiting**: Consider adding rate limiting for large port ranges to avoid overwhelming the target
3. **Logging**: Scans are not logged by default; consider adding audit logging for production use
4. **Error Handling**: Proper error handling prevents crashes and provides useful feedback

## Performance Notes

- Native scanning is fastest for small port ranges (< 100 ports)
- Nmap is recommended for large port ranges (> 1000 ports)
- Timeout affects scan duration: lower timeout = faster scans but more false negatives
- Parallel scanning is not implemented to avoid overwhelming the target system

## Future Enhancements

Potential improvements for future versions:
- UDP port scanning support
- Parallel/concurrent scanning with configurable thread pool
- Export results to CSV/JSON
- Scan history and saved configurations
- Port range presets (common ports, all ports, etc.)
- Integration with vulnerability databases
- Network range scanning (CIDR notation)
- Custom service detection rules

## Testing

The module has been verified to:
- ✅ Compile successfully (both Rust and TypeScript)
- ✅ Pass type checking
- ✅ Integrate properly with existing Tauri commands
- ✅ Follow existing code patterns and structure

Manual testing recommended:
- Test scanning localhost (127.0.0.1)
- Test scanning with various port ranges
- Test with and without nmap installed
- Test timeout adjustments
- Verify service detection accuracy

## Dependencies

### Rust:
- `serde` - Serialization/deserialization
- `std::net::TcpStream` - TCP connections
- `std::process::Command` - Execute nmap
- `std::time::Duration` - Timeout handling

### TypeScript/React:
- `@tauri-apps/api` - Tauri API bindings
- `antd` - UI components
- `react` - UI framework

No additional dependencies were added to the project.
