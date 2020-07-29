

//meta中为自定义变量
//hidden： 是否显示在侧边栏
//title：  侧边栏、tag标签 名称
//value：  绑定的权限值（此值与用户的权限值permissionList关联，决定显示哪些路由）
export default [
  {
    path: '/',
    name: 'startPage',
    meta: { hidden: true, title: '加载中', value: 'startPage' },
    component: () => import('src/views/StartPage'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('src/views/Login'),
    meta: { hidden: true, title: '登录', value: 'login' },
  }, {
    path: '/home',
    component: () => import('src/views/Layout'),
    redirect:'/home/homePage',
    meta: { hidden: true, title: '首页', value: 'home' },
    children: [{
      path: 'homePage',
      name: 'homePage',
      component: () => import('src/views/content/homepage/HomePage'),
      meta: { title: '首页' },
    }],
  }, {
    path: '/letClue',
    name: 'letClue',
    component: () => import('src/views/Layout'),
    meta: { title: '线索管理', value: 'letClueManage' },
    children: [
      {
        path: 'letterClue',
        name: 'letClue-letterClue',
        component: () => import('src/views/content/letter/LetterClue'),
        meta: { title: '表单填写', value: 'letClue', }
      }, {
        path: 'letterClueClassify',
        name: 'letClue-letterClueClassify',
        component: () => import('src/views/content/letter/LetterClueClassify'),
        meta: { title: '表单分类', value: 'letClueType', }
      }
    ]
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('src/views/Layout'),
    meta: { auth: true, title: '系统管理', value: 'systemManage', },
    children: [
      {
        path: 'user',
        name: 'manage-user',
        component: () => import('src/views/content/systemManagement/User'),
        meta: { title: '用户管理', value: 'user', }
      }, {
        path: 'role',
        name: 'manage-role',
        component: () => import('src/views/content/systemManagement/Role'),
        meta: { title: '角色管理', value: 'role', }
      }, {
        path: 'authority',
        name: 'manage-authority',
        component: () => import('src/views/content/systemManagement/Permission/Index'),
        meta: { title: '权限管理', value: 'permission', }
      }, {
        path: 'organizationStructure',
        name: 'manage-organizationStructure',
        component: () => import('src/views/content/systemManagement/Unit/Index'),
        meta: { title: '单位管理', value: 'unit', }
      }, {
        path: 'dataDictionary',
        name: 'manage-dataDictionary',
        component: () => import('src/views/content/systemManagement/DataDictionary'),
        meta: { title: '数据字典', value: 'dicAll', }
      }, {
        path: 'sendMessage',
        name: 'manage-sendMessage',
        component: () => import('src/views/content/systemManagement/SendMessage'),
        meta: { title: '发送消息', value: 'sendMessage', }
      }
    ],
  },
];
