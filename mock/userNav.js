const userNavDataSource = [
  // dashboard
  {
    name: 'dashboard',
    parentId: '0',
    id: '01',
    meta: {
      icon: 'HeartOutlined',
      title: 'pages.dashboard.title',
      show: true,
    },
    component: 'RouteView',
    redirect: '/workplace',
  },
  {
    name: 'workplace',
    parentId: '01',
    id: '001',
    meta: {
      icon: 'HistoryOutlined',
      title: 'pages.dashboard.workplace.title',
      show: true,
    },
    component: 'dashboard/workplace/index',
    path: '/workplace',
  },
  {
    name: 'Analysis',
    parentId: '01',
    id: '002',
    meta: {
      icon: 'HeartOutlined',
      title: 'pages.dashboard.analysis.title',
      show: true,
    },
    component: 'dashboard/analysis/index',
    path: '/dashboard/analysis',
  },
  {
    name: 'nested',
    parentId: '0',
    id: '02',
    meta: {
      icon: 'AppstoreAddOutlined',
      title: 'pages.nested.title',
      show: true,
    },
    component: 'RouteView',
    redirect: '/nested/menu1',
  },
  {
    name: 'nested-menu1',
    path: '/nested/menu1',
    parentId: '02',
    id: '003',
    meta: { title: 'pages.nested.menu1.title', keepAlive: false },
    redirect: '/nested/menu1/menu1-1',
    component: 'examples/nested/menu1',
  },
  {
    name: 'nested-menu1-1',
    parentId: '003',
    id: '0001',
    path: '/nested/menu1/menu1-1',
    meta: { title: 'pages.nested.menu1-1.title' },
    component: 'examples/nested/menu1-1',
  },
];

module.exports = {
  'GET /api/currentUserNav': (req, res) => {
    res.send(userNavDataSource);
  },
};
