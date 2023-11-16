import LearnPage, { lessionsRouters } from '@/lessions';
import HomePage from '@/pages';
import { Outlet, RouteObject } from 'react-router-dom';
import Root from './root';
import LessionDoc from '@/lessions/components/LessionDoc';
import DictionaryPage from '@/modules/dictionary';
import { MenuProps, Spin } from 'antd';
import TauriModule from '@/modules/tauri';
import ToolsModule from '@/modules/tools';

export const routers: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
    errorElement: <h1>404</h1>,
    children: [
      ToolsModule,
      TauriModule,
      {
        path: 'dictionary',
        element: <DictionaryPage />,
      },
    ],
  },
];

const convertToMenu = (routers: RouteObject[], parrentPath = ''): MenuProps['items'] => {
  return routers.map((item) => {
    if (item.children) {
      let children = convertToMenu(item.children, item.path);
      return {
        key: (parrentPath + '/' + item.path) as string,
        label: item.path as string,
        children,
      };
    }
    return {
      key: (parrentPath + '/' + item.path) as string,
      label: item.path as string,
    };
  });
};

export const menu: MenuProps['items'] = convertToMenu(routers[0].children!);
