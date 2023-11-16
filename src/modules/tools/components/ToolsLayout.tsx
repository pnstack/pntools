import { Outlet } from 'react-router-dom';

const ToolsLayout = () => {
  return (
    <div className="flex h-0 min-h-full flex-1 flex-col overflow-auto">
      <Outlet />
    </div>
  );
};

export default ToolsLayout;
