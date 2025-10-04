import { RouteObject } from 'react-router-dom';
import ModuleLayout from '@/components/ModuleLayout';
import TauriShell from './components/shell';
import Timer from './components/time';
import TauriStorage from './components/storage';
import TauriImage from './components/image';
import PortExplorer from './components/port-explorer';

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
    {
      path: 'PortExplorer',
      element: <PortExplorer />,
    },
  ],
};

export default TauriModule;
