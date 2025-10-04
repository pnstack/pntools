import React, { useState, useRef, useEffect } from 'react';
import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { menus } from '@/routes';

const { Sider } = Layout;

interface LeftSidebarProps {
  onWidthChange?: (width: number) => void;
}

const LeftSidebar: React.FC<LeftSidebarProps> = ({ onWidthChange }) => {
  const navigate = useNavigate();
  const [sidebarWidth, setSidebarWidth] = useState(200);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  const startResizing = React.useCallback(() => {
    setIsResizing(true);
  }, []);

  const stopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = React.useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing) {
        const newWidth = mouseMoveEvent.clientX;
        if (newWidth >= 150 && newWidth <= 400) {
          setSidebarWidth(newWidth);
          onWidthChange?.(newWidth);
        }
      }
    },
    [isResizing, onWidthChange]
  );

  useEffect(() => {
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResizing);
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [resize, stopResizing]);

  return (
    <>
      <Sider
        width={sidebarWidth}
        ref={sidebarRef}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          transition: isResizing ? 'none' : 'width 0.2s',
        }}
      >
        <div className="demo-logo-vertical" style={{ padding: '16px', textAlign: 'center' }}>
          <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>PNTools</span>
        </div>
        <Menu
          onClick={({ keyPath }) => {
            console.log('🚀 ~ file: LeftSidebar.tsx ~ keyPath:', keyPath);
            navigate(`${keyPath[0]}`);
          }}
          theme="dark"
          mode="inline"
          items={menus}
          style={{ borderRight: 0 }}
        />
      </Sider>
      <div
        onMouseDown={startResizing}
        style={{
          width: '4px',
          height: '100vh',
          position: 'fixed',
          left: sidebarWidth,
          top: 0,
          cursor: 'col-resize',
          backgroundColor: 'transparent',
          zIndex: 1000,
          transition: isResizing ? 'none' : 'left 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#1890ff';
        }}
        onMouseLeave={(e) => {
          if (!isResizing) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      />
    </>
  );
};

export default LeftSidebar;
