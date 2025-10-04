import React, { useState } from 'react';
import { Button, Input, InputNumber, Table, Tag, Space, Card, Alert, Switch } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { invoke } from '@tauri-apps/api/core';

interface PortScanResult {
  port: number;
  is_open: boolean;
  service?: string;
}

const PortExplorer = () => {
  const [host, setHost] = useState('127.0.0.1');
  const [startPort, setStartPort] = useState(1);
  const [endPort, setEndPort] = useState(1024);
  const [useNmap, setUseNmap] = useState(false);
  const [timeoutMs, setTimeoutMs] = useState(1000);
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState<PortScanResult[]>([]);
  const [nmapAvailable, setNmapAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string>('');

  const checkNmapAvailability = async () => {
    try {
      const available = await invoke<boolean>('check_nmap_available');
      setNmapAvailable(available);
    } catch (err) {
      console.error('Error checking nmap availability:', err);
      setNmapAvailable(false);
    }
  };

  React.useEffect(() => {
    checkNmapAvailability();
  }, []);

  const scanPorts = async () => {
    setScanning(true);
    setError('');
    setResults([]);

    try {
      const scanResults = await invoke<PortScanResult[]>('scan_ports_command', {
        host,
        startPort,
        endPort,
        useNmap,
        timeoutMs,
      });

      setResults(scanResults);
    } catch (err) {
      setError(String(err));
      console.error('Error scanning ports:', err);
    } finally {
      setScanning(false);
    }
  };

  const columns = [
    {
      title: 'Port',
      dataIndex: 'port',
      key: 'port',
      sorter: (a: PortScanResult, b: PortScanResult) => a.port - b.port,
    },
    {
      title: 'Status',
      dataIndex: 'is_open',
      key: 'is_open',
      render: (isOpen: boolean) => (
        <Tag color={isOpen ? 'green' : 'red'}>
          {isOpen ? 'OPEN' : 'CLOSED'}
        </Tag>
      ),
      filters: [
        { text: 'Open', value: true },
        { text: 'Closed', value: false },
      ],
      onFilter: (value: boolean | React.Key, record: PortScanResult) => record.is_open === value,
    },
    {
      title: 'Service',
      dataIndex: 'service',
      key: 'service',
      render: (service?: string) => service || '-',
    },
  ];

  const openPorts = results.filter((r) => r.is_open);

  return (
    <div className="flex h-full flex-col p-4">
      <Card title="Port Scanner" className="mb-4">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div className="flex flex-col space-y-2">
            <label>Target Host/IP:</label>
            <Input
              placeholder="Enter host or IP address"
              value={host}
              onChange={(e) => setHost(e.target.value)}
              disabled={scanning}
            />
          </div>

          <div className="flex flex-row space-x-4">
            <div className="flex flex-1 flex-col space-y-2">
              <label>Start Port:</label>
              <InputNumber
                min={1}
                max={65535}
                value={startPort}
                onChange={(value) => setStartPort(value || 1)}
                disabled={scanning}
                style={{ width: '100%' }}
              />
            </div>
            <div className="flex flex-1 flex-col space-y-2">
              <label>End Port:</label>
              <InputNumber
                min={1}
                max={65535}
                value={endPort}
                onChange={(value) => setEndPort(value || 1024)}
                disabled={scanning}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div className="flex flex-col space-y-2">
            <label>Timeout (ms):</label>
            <InputNumber
              min={100}
              max={10000}
              value={timeoutMs}
              onChange={(value) => setTimeoutMs(value || 1000)}
              disabled={scanning}
              style={{ width: '100%' }}
            />
          </div>

          <div className="flex flex-row items-center space-x-2">
            <label>Use nmap:</label>
            <Switch
              checked={useNmap}
              onChange={setUseNmap}
              disabled={scanning || !nmapAvailable}
            />
            {nmapAvailable === false && (
              <span className="text-sm text-gray-500">
                (nmap not available)
              </span>
            )}
          </div>

          {error && (
            <Alert
              message="Scan Error"
              description={error}
              type="error"
              showIcon
              closable
              onClose={() => setError('')}
            />
          )}

          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={scanPorts}
            loading={scanning}
            disabled={!host || startPort > endPort}
            block
          >
            {scanning ? 'Scanning...' : 'Start Scan'}
          </Button>

          {results.length > 0 && (
            <Alert
              message={`Scan Complete: ${openPorts.length} open port(s) found out of ${results.length} scanned`}
              type="success"
              showIcon
            />
          )}
        </Space>
      </Card>

      {results.length > 0 && (
        <Card title="Scan Results" className="flex-1">
          <Table
            columns={columns}
            dataSource={results}
            rowKey="port"
            pagination={{ pageSize: 20 }}
            size="small"
            scroll={{ y: 400 }}
          />
        </Card>
      )}
    </div>
  );
};

export default PortExplorer;
