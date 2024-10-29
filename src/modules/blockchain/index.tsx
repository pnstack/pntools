import ModuleLayout from '@/components/ModuleLayout';
import { RouteObject } from 'react-router-dom';
import BlockchainPage from './pages';

const BlockchainModule: RouteObject = {
  path: 'blockchain',
  element: <ModuleLayout />,
  children: [
    {
      path: 'blockchain',
      element: <BlockchainPage />,
    },
  ],
};

export default BlockchainModule;
