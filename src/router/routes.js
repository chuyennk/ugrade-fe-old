const routes = [
  {
    path: '/',
    component: () => import('layouts/WelcomeLayout.vue'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Index.vue') },
      { path: '/login', name: 'login', component: () => import('pages/Login.vue') },
    ],
  },
  {
    path: '/ugrade',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/search', name: 'Search', component: () => import('pages/Search.vue') },
      { path: '/custinfo', name: 'CustInfo', component: () => import('pages/CustInfo.vue') },
      { path: '/fss', name: 'Fss', component: () => import('pages/FssModule.vue') },
      { path: '/scorecard', name: 'Scorecard', component: () => import('pages/ScorecardModule.vue') },
    ],
    meta: {requireAuth: true}
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
]

export default routes
