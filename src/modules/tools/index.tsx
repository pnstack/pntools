import ToolsLayout from './components/ToolsLayout';
import { RandomPasswordTool } from './tools';
import ConvertTool from './tools/Convert';

import { RouteObject } from 'react-router-dom';

const ToolsModule: RouteObject = {
  path: 'tools',
  element: <ToolsLayout />,
  children: [
    {
      path: 'random-password-tool',
      element: <RandomPasswordTool />,
    },
    {
      path: 'convert-tool',
      element: <ConvertTool />,
    },
  ],
};

export default ToolsModule;
