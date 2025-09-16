import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ActiveUserList from "@/views/UserManagement/ActiveUserList.vue";
import List from "@/views/Employee/List.vue";
import Add from "@/views/Employee/Add.vue";
import Edit from "@/views/Employee/Edit.vue";
import TrainingReport from "@/views/ReportManagement/TrainingReport.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Ecommerce.vue'),
      meta: {
        title: 'Training Management Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: {
        title: 'Calendar',
        requiresAuth: true,
      },
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: {
        title: 'Profile',
        requiresAuth: true,
      },
    },
    {
      path: '/form-elements',
      name: 'Form Elements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: {
        title: 'Form Elements',
        requiresAuth: true,
      },
    },
    {
      path: '/basic-tables',
      name: 'Basic Tables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: {
        title: 'Basic Tables',
        requiresAuth: true,
      },
    },
    {
      path: '/line-chart',
      name: 'Line Chart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
      meta: {
        title: 'Line Chart',
        requiresAuth: true,
      },
    },
    {
      path: '/bar-chart',
      name: 'Bar Chart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
      meta: {
        title: 'Bar Chart',
        requiresAuth: true,
      },
    },
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: {
        title: 'Alerts',
        requiresAuth: true,
      },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: {
        title: 'Avatars',
        requiresAuth: true,
      },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: {
        title: 'Badge',
        requiresAuth: true,
      },
    },

    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: {
        title: 'Buttons',
        requiresAuth: true,
      },
    },

    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: {
        title: 'Images',
        requiresAuth: true,
      },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: {
        title: 'Videos',
        requiresAuth: true,
      },
    },
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: {
        title: 'Blank',
        requiresAuth: true,
      },
    },

    {
      path: '/error-404',
      name: '404 Error',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: {
        title: '404 Error',
      },
    },

    {
      path: '/',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: {
        title: 'Signin',
      },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: {
        title: 'Signup',
      },
    },

    {
      path: '/forgot-password',
      name: 'ForgotPassword',
      component: () => import('../views/Auth/ForgotPassword.vue')
    },
    {
      path: '/reset-password',
      name: 'ResetPassword',
      component: () => import('../views/Auth/ResetPassword.vue')
    },
    {
      path: '/user-management/pending-users',
      name: 'Pending User List',
      component: () => import('../views/UserManagement/PendingUserList.vue'),
      meta: {
        title: 'Pending User List',
        requiresAuth: true,
      },
    },
    {
      path: '/user-management/active-users',
      name: 'ActiveUserList',
      component: ActiveUserList,
      meta: {
        title: 'Active User List',
        requiresAuth: true,
      },
    },
    {
      path: '/employee-management/list',
      name: 'List Employees',
      component: List,
      meta: {
        title: 'Employee List',
        requiresAuth: true,
      },
    },
    {
      path: '/employee-management/add',
      name: 'Add Employee',
      component: Add,
      meta: {
        title: 'Add Employee',
        requiresAuth: true,
      },
    },
    {
      path: '/employee-management/edit/:id',
      name: 'Edit Employee',
      component: Edit,
      props: true,
      meta: {
        title: 'Edit Employee',
        requiresAuth: true,
      },
    },
    {
      path: "/organizer-management/add",
      name: "AddOrganizer",
      component: () => import("@/views/Organizer/Add.vue"),
      meta: {
        title: 'Add Organizer',
        requiresAuth: true,
      },
    },
    {
      path: "/organizer-management/list",
      name: "ListOrganizers",
      component: () => import("@/views/Organizer/List.vue"),
      meta: {
        title: 'Organizer List',
        requiresAuth: true,
      },
    },
    {
      path: '/organizer-management/edit/:id',
      name: 'EditOrganizer',
      component: () => import('@/views/Organizer/Edit.vue'),
      props: true,
      meta: {
        title: 'Organizer Edit',
        requiresAuth: true,
      },
    },
    {
      path: '/training-management/list',
      name: 'ListTrainings',
      component: () => import('@/views/Training/List.vue'),
      meta: {
        title: 'Training List',
        requiresAuth: true,
      },
    },
    {
      path: '/training-management/add',
      name: 'AddTraining',
      component: () => import('@/views/Training/Add.vue'),
      meta: {
        title: 'Add Training',
        requiresAuth: true,
      },
    },
    {
      path: '/training-management/edit/:id',
      name: 'EditTraining',
      component: () => import('@/views/Training/Edit.vue'),
      props: true,
      meta: {
        title: 'Edit Training',
        requiresAuth: true,
      },
    },
    {
      path: '/training-management/assign',
      name: 'AssignEmployees',
      component: () => import('@/views/Training/Assign.vue'),
      meta: {
        title: 'Employee assign in Training',
        requiresAuth: true
      },

    },
    {
      path: '/training-management/assign-list',
      name: 'AssignList',
      component: () => import('@/views/Training/AssignList.vue'),
      meta: {
        title: 'Assigned Employee List',
       requiresAuth: true
     },
    },
    {
      path: "/report-management/training-report",
      name: "TrainingReport",
      component: TrainingReport,
      meta: {
        title: 'Training Report',
       requiresAuth: true
     },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isLoggedIn = !!authStore.token

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

router.beforeEach((to, from, next) => {
  document.title = `Planning Division ${to.meta.title}`
  next()
})

export default router
