import type { RouteRecordRaw } from 'vue-router';
import type { MenuDataItem } from './typing';
import type { RouteItem } from '@/api/user/login';
import { getCurrentUserNav } from '@/api/user/login';
import Layout from '@/layouts/index.vue';

// 前端未找到页面路由（固定不用改）
const notFoundRouter: MenuDataItem = {
  path: '*',
  redirect: '/404',
  meta: {
    title: 'Not Found',
    hideInMenu: true,
  },
};

// 根级菜单
const rootRouter: RouteRecordRaw = {
  name: 'index',
  path: '/',
  redirect: '/dashboard',
  meta: {
    title: '首页',
  },
  component: Layout,
  children: [] as RouteRecordRaw[],
};

export const generator = (
  routeMap: RouteItem[],
  parentId: string | number,
  routeItem?: MenuDataItem,
): MenuDataItem[] => {
  return routeMap
    .filter(item => item.parentId === parentId)
    .map(item => {
      const { title, hideInMenu, hideChildrenInMenu, target, icon, authority } = item.meta || {};
      const currentRouter: MenuDataItem = {
        // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
        path: item.path || `${(routeItem && routeItem.path) || ''}/${item.name}`,
        // 路由名称，建议唯一
        name: item.name || `${item.id}`,
        // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
        meta: {
          title,
          icon: icon || undefined,
          hideInMenu,
          hideChildrenInMenu,
          target,
          authority,
        },
        // 该路由对应页面的 组件 (动态加载 @/views/ 下面的路径文件)
        component: () => import(`@/views/${item.component}`),
      };

      // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
      if (!currentRouter.path.startsWith('http')) {
        currentRouter.path = currentRouter.path.replace('//', '/');
      }

      // 重定向
      item.redirect && (currentRouter.redirect = item.redirect);

      // 子菜单，递归处理
      currentRouter.children = generator(routeMap, item.id, currentRouter);
      if (currentRouter.children && currentRouter.children.length <= 0) {
        delete currentRouter.children;
      }
      return currentRouter;
    })
    .filter(item => item);
};

export const generatorDynamicRouter = () => {
  return new Promise<RouteRecordRaw>((resolve, reject) => {
    getCurrentUserNav()
      .then(menuNav => {
        // root id = 0;
        const routes = generator(menuNav, 0, undefined);
        routes.push(notFoundRouter);
        rootRouter.children = routes;
        resolve(rootRouter);
      })
      .catch(err => {
        reject(err);
      });
  });
};
