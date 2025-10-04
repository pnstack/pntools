import LearnPage, { lessionsRouters } from '@/lessions';
import HomePage from '@/pages';
import { Outlet, RouteObject } from 'react-router-dom';
import Root from './root';
import LessionDoc from '@/lessions/components/LessionDoc';
import DictionaryPage from '@/modules/dictionary';
import { MenuProps, Spin } from 'antd';
import TauriModule from '@/modules/tauri';
import ToolsModule from '@/modules/tools';
import BlockchainModule from '@/modules/blockchain';
import ErrorPage from '@/pages/error';
import {
  HomeOutlined,
  ToolOutlined,
  AppstoreOutlined,
  BlockOutlined,
  BookOutlined,
} from '@ant-design/icons';

export const routers: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      ToolsModule,
      TauriModule,
      BlockchainModule,
      {
        path: 'dictionary',
        element: <DictionaryPage />,
      },
    ],
  },
];

const getIconForRoute = (path: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    '/': <HomeOutlined />,
    'tools': <ToolOutlined />,
    'tauri': <AppstoreOutlined />,
    'blockchain': <BlockOutlined />,
    'dictionary': <BookOutlined />,
  };
  return iconMap[path] || null;
};

const convertToMenu = (routers: RouteObject[], parrentPath = ''): MenuProps['items'] => {
  return routers.map((item) => {
    const icon = getIconForRoute(item.path as string);
    if (item.children) {
      const children = convertToMenu(item.children, item.path);
      return {
        key: (parrentPath + '/' + item.path) as string,
        label: item.path as string,
        icon,
        children,
      };
    }
    return {
      key: (parrentPath + '/' + item.path) as string,
      label: item.path as string,
      icon,
    };
  });
};

export const menus: MenuProps['items'] = convertToMenu(routers[0].children!);
