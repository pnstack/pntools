import { useState } from 'react';
import reactLogo from './assets/react.svg';
import { invoke } from '@tauri-apps/api/tauri';
import { Button, Input } from 'antd';
import TauriShell from './components/shell';
import Timer from './components/time';
import { RouteObject } from 'react-router-dom';
import ModuleLayout from '@/components/ModuleLayout';
import TauriStorage from './components/storage';
import TauriImage from './components/image';

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
    {
      path: 'Storage',
      element: <TauriStorage />,
    },
    {
      path: 'Image',
      element: <TauriImage />,
    },
  ],
};

export default TauriModule;
