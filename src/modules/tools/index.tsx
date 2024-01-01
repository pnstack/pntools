import ToolsLayout from './components/ToolsLayout';
import { RandomPasswordTool } from './tools';

import { RouteObject } from 'react-router-dom';
import RemoveLines from './tools/remove-lines';

const ToolsModule: RouteObject = {
  path: 'tools',
  element: <ToolsLayout />,
  children: [
    {
      path: 'random-password-tool',
      element: <RandomPasswordTool />,
    },

    {
      path: 'Convert',
      element: <RemoveLines />,
    },
  ],
};

export default ToolsModule;
