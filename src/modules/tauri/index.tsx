import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { invoke } from '@tauri-apps/api/tauri';
import { Button, Input } from 'antd';
import TauriShell from './components/shell';
import Timer from './components/time';
import { RouteObject } from 'react-router-dom';
import ModuleLayout from '@/components/ModuleLayout';

const TauriModule: RouteObject = {
  path: 'tauri',
  element: <ModuleLayout />,
  children: [
    {
      path: 'shell',
      element: <TauriShell />,
    },
    {
      path: 'Timer',
      element: <Timer />,
    },
  ],
};

export default TauriModule;
