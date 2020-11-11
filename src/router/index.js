import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/Login'
import Map from '@/components/map/Map'
import Project from '@/components/common/project/Project'
import Home from '@/components/common/Home'
import Task from '@/components/common/project/task/Task'
import Scan from '@/components/scan/Scan'
import TimeSeries from '@/components/time-series/TimeSeries'
import Map3D from '@/components/3dmap/3DMap'
import Ndvi from '@/components/ndvi/Ndvi'
import Thermal from '@/components/thermal/Thermal'
import CheckHistory from '@/components/management/checkhistory/CheckHistory'
import Preferences from '@/components/management/Preferences'
import Facility from '@/components/management/facility/Facility'
import User from '@/components/management/user/User'
import GCPInterface from '@/components/gcpi/GCPInterface'
import Device from '@/components/management/device/Device'
import UserMyPage from '@/components/user/UserMyPage'
import Intro from '@/components/common/Intro'
import Mission from '@/components/management/mission/Mission'
import SelectAccountType from '@/components/login/SelectAccountType'
import CreateUserAccount from '@/components/login/CreateUserAccount'
import CreateProviderAccount from '@/components/login/CreateProviderAccount'
import UserContainer from '@/components/user/UserContainer'
import UserHome from '@/components/user/UserHome'
import AreaMission from '@/components/user/area-mission/AreaMission'
import FarmDiary from '@/components/user/FarmDiary'
import UserSchedule from '@/components/user/schedule/Schedule_user'
import ProviderList from '@/components/user/ProviderList'
import ProviderHome from '@/components/provider/ProviderHome'
import MissionList from '@/components/provider/MissionList'
import ThematicMap from '@/components/provider/ThematicMap'
import StatisticChart from '@/components/provider/StatisticChart'
import CorrelationChart from '@/components/provider/CorrelationChart'
import UserList from '@/components/provider/UserList'
import UserFarmDiary from '@/components/provider/UserFarmDiary'
import MissionHistory from '@/components/provider/MissionHistory'
import MissionHistory4user from '@/components/user/MissionHistory'
import Schedule from '@/components/provider/schedule/Schedule'
import GCSImport from '@/components/provider/GCSImport'
import MissionGenerateReport from '@/components/provider/MissionGenerateReport'
import MissionGenerateReport4user from '@/components/user/MissionGenerateReport4user'
import ProviderContainer from '@/components/provider/ProviderContainer'
import ProviderMap from '@/components/map/ProviderMap'
import ProviderMyPage from '@/components/common/ProviderMyPage'
import AnalysisMap from '@/components/map/AnalysisMap'
import AnalysisTimeSeries from '@/components/map/AnalysisMap'
import AnalysisDiary from '@/components/map/AnalysisMap'
import AnalysisCompare from '@/components/map/AnalysisMap'
import AnalysisDEM from '@/components/map/AnalysisMap'
import SprayPlanMap from '@/components/map/SprayPlanMap'
import Demo from '@/components/login/Demo'

Vue.use(Router)

window.addEventListener('scroll', this.scrollBehavior);

const router = new Router({
  // {모바일 빌드}시 주석처리
  mode: 'history',
  history: true,
  saveScrollPosition: true,
  routes: [
    {
      path: '/',
      name: 'intro',
      props: true,
      component: Intro
    },
    {
      path: '/gs',
      name: 'gs',
      component: Demo
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/selectAccountType',
      name: 'selectAccountType',
      component: SelectAccountType
    },
    {
      path: '/createUserAccount',
      name: 'createUserAccount',
      component: CreateUserAccount
    },
    {
      path: '/createProviderAccount',
      name: 'createProviderAccount',
      component: CreateProviderAccount
    },
    {
      path: '/providerMap/:projectId/:taskId/:missionId/:areaId',
      name: 'provider2DMap',
      component: ProviderMap,
      props: true
    },
    {
      path: '/providerMap/:projectId',
      name: 'providerTimelineMap',
      component: ProviderMap,
      props: true
    },
    {
      path: '/analysisMap/:projectId/:taskId/:missionId/:areaId',
      name: 'analysisMap',
      component: AnalysisMap,
      props: true
    },
    {
      path: '/analysisTimeSeries/:projectId/:taskId/:missionId/:areaId',
      name: 'analysisTimeSeries',
      component: AnalysisTimeSeries,
      props: true
    },
    {
      path: '/analysisDiary/:projectId/:taskId/:missionId/:areaId',
      name: 'analysisDiary',
      component: AnalysisDiary,
      props: true
    },
    {
      path: '/analysisCompare/:projectId/:taskId/:missionId/:areaId',
      name: 'analysisCompare',
      component: AnalysisCompare,
      props: true
    },
    {
      path: '/analysisDEM/:projectId/:taskId/:missionId/:areaId',
      name: 'analysisDEM',
      component: AnalysisDEM,
      props: true
    },
    {
      path: '/sprayPlanMap/:projectId/:taskId/:missionId',
      name: 'sprayPlanMap',
      component: SprayPlanMap,
      props: true
    },
    {
      path: '/map/:projectId/:taskId',
      name: 'map',
      component: Map,
      props: true
    },
    {
      path: '/map/:projectId',
      name: 'projectMap',
      component: Map,
      props: true
    },
    {
      path: '/map',
      name: 'allProjectMap',
      component: Map
    },
    {
      path: '/scan/:projectId/:taskId',
      name: 'scan',
      props: true,
      component: Scan,
      meta: { requiresAuth: true }
    },
    {
      name: '3dmap',
      path: '/3dmap/:projectId/:taskId',
      props: true,
      component: Map3D,
      meta: { requiresAuth: true }
    },
    {
      name: 'ndvi',
      path: '/ndvi/:projectId/:taskId',
      props: true,
      component: Ndvi,
      meta: { requiresAuth: true }
    },
    {
      name: 'projectNDVI',
      path: '/ndvi/:projectId',
      props: true,
      component: Ndvi,
      meta: { requiresAuth: true }
    },
    // {
    //   name: 'ai',
    //   path: '/ai/:projectId/:taskId',
    //   props: true,
    //   component: Ai,
    //   meta: { requiresAuth: true }
    // },
    // {
    //   name: 'projectAI',
    //   path: '/ai/:projectId',
    //   props: true,
    //   component: Ai,
    //   meta: { requiresAuth: true }
    // },
    {
      name: 'thermal',
      path: '/thermal/:projectId/:taskId',
      props: true,
      component: Thermal,
      meta: { requiresAuth: true }
    },
    {
      name: 'projectThermal',
      path: '/thermal/:projectId',
      props: true,
      component: Thermal,
      meta: { requiresAuth: true }
    },
    {
      path: '/userContainer',
      name: 'userContainer',
      component: UserContainer,
      redirect: { name: 'userHome' },
      meta: { requiresAuth: true, requiresUserType: 'consumer' },
      children: [
        {
          path: '/userHome',
          name: 'userHome',
          component: UserHome
        },
        {
          path: '/schedule_user',
          name: 'schedul_user',
          component: UserSchedule
        },
        {
          name: 'userMypage',
          path: '/userMypage',
          props: true,
          component: UserMyPage
        },
        {
          path: '/areaMission',
          name: 'areaMission',
          component: AreaMission
        },
        {
          path: '/farmDiary',
          name: 'farmDiary',
          component: FarmDiary
        },
        {
          path:
            '/missionGenerateReport4user/:missionRequestId/:requestMissionTypeId/:missionId',
          name: 'editMissionGenerateReport4user',
          props: true,
          component: MissionGenerateReport4user
        },
        {
          path: '/providerList',
          name: 'providerList',
          component: ProviderList
        },
        {
          path: '/missionHistory4user/:missionId/:areaId',
          name: 'missionHistory4user',
          component: MissionHistory4user
        }
      ]
    },
    {
      path: '/providerContainer',
      name: 'providerContainer',
      component: ProviderContainer,
      redirect: { name: 'providerHome' },
      meta: { requiresAuth: true, requiresUserType: 'provider' },
      children: [
        {
          name: 'providerHome',
          path: '/providerHome',
          props: true,
          component: ProviderHome
        },
        {
          name: 'providerMypage',
          path: '/providerMypage',
          props: true,
          component: ProviderMyPage
        },
        {
          path: '/missionList',
          name: 'missionList',
          component: MissionList
        },
        {
          path: '/thematicMap',
          name: 'thematicMap',
          component: ThematicMap
        },
        {
          path: '/statisticChart',
          name: 'statisticChart',
          component: StatisticChart
        },
        {
          path: '/correlationChart',
          name: 'correlationChart',
          component: CorrelationChart
        },
        {
          path: '/waitingMissionList',
          name: 'waitingMissionList',
          component: Schedule
        },
        {
          path: '/userList',
          name: 'userList',
          component: UserList
        },
        {
          path: '/userFarmDiary/:user_id',
          name: 'userFarmDiary',
          component: UserFarmDiary
        },
        {
          path: '/missionList/:user_id',
          name: 'userMissionList',
          component: MissionList,
          props: true
        },
        {
          path: '/missionHistory/:missionId/:areaId',
          name: 'missionHistory',
          component: MissionHistory
        },
        {
          path: '/schedule',
          name: 'schedule',
          component: Schedule
        },
        {
          path: '/gcsImport',
          name: 'gcsImport',
          component: GCSImport
        },
        {
          // path:'/missionGenerateReport/:requestMissionTypeId',
          path: '/missionGenerateReport/:missionRequestId/:requestMissionTypeId',
          name: 'addMissionGenerateReport',
          props: true,
          component: MissionGenerateReport
        },
        {
          path:
            '/missionGenerateReport/:missionRequestId/:requestMissionTypeId/:missionId',
          name: 'editMissionGenerateReport',
          props: true,
          component: MissionGenerateReport
        }
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
      children: [
        {
          path: '/project',
          name: 'project',
          component: Project
        },
        {
          name: 'task',
          path: 'project/:project_id',
          props: true,
          component: Task
        },
        {
          name: 'facility',
          path: '/facility',
          props: true,
          component: Facility
        },
        {
          name: 'checkHistory',
          path: 'facility/:basicId/checkhistorys',
          props: true,
          component: CheckHistory
        },
        {
          name: 'user',
          path: '/user',
          props: true,
          component: User
        },
        {
          name: 'device',
          path: '/device',
          props: true,
          component: Device
        },
        {
          name: 'preferences',
          path: '/preferences',
          props: true,
          component: Preferences
        },
        {
          name: 'TimeSeries',
          path: 'TimeSeries',
          props: true,
          component: TimeSeries
        },
        {
          name: 'gcpi',
          path: 'gcpi',
          props: true,
          component: GCPInterface
        },
        {
          path: '/mission/:projectId/:taskId',
          name: 'mission',
          component: Mission,
          props: true
        },
        {
          path: '/mission/:projectId',
          name: 'projectMission',
          component: Mission,
          props: true
        },
        {
          path: '/mission',
          name: 'allProjectMission',
          component: Mission
        }
      ]
    }
  ],
  // saveScrollPosition() {
  //   let el = document.querySelector('.page-content')
  //   return { x: el.scrollLeft, y: el.scrollTop }
  // },

  scrollBehavior (to, from, savedPosition) {
    let position = { x: 0, y: 0 }

    console.log('$$$ Keep scroll position when using browser buttons')
    console.log('$$$ to: ', to)
    console.log('$$$ from: ', from)
    console.log('$$$ savedPosition: ', savedPosition)

    if (savedPosition) {
      position = savedPosition
      console.log('$$$$$$$$$$$$$$$$$$$ [scroll] exist savedPosition !!')
    }

    // position = false

    // Workaround for transitions scrolling to the top of the page
    // However, there are still some problems being fixed by the vue team
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log('$$$$$$$$$$$$$$$$$$$ [scroll] resolve position => ', position)
        resolve(position)
      }, 500)
    })
  }

})

// router.replace({path: '/login', redirect: 'home'})
router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth) {
    const account_id = router.app.$session.get('account_id') || null

    if (account_id == null) {
      next({
        name: 'login',
        query: { redirect: to.fullPath }
      })
    } else {
      const record = to.matched.find(record => record.meta.requiresUserType)

      if (record && record.meta.requiresUserType) {
        const user_type = router.app.$session.get('user_type') || null

        if (record.meta.requiresUserType == user_type) {
          next()
        } else {
          if (from) {
            alert('이 페이지에 접근 권한이 없습니다. 홈 화면으로 이동합니다.')
            let page = '/userHome'
            switch (user_type) {
              case 'admin':
                page = '/home'
                break
              case 'provider':
                page = '/providerHome'
                break
              case 'consumer':
              default:
                page = '/userHome'
                break
            }
            next(page)
          } else {
            alert(
              '이 페이지에 접근 권한이 없습니다. 로그인 페이지로 이동합니다.'
            )
            next({
              name: 'login'
            })
          }
        }
      } else {
        next()
      }
    }
  } else {
    next()
  }
  // console.log('[ROUTER] 전역 네비게이션 가드 호출', from.name, '==>', to.name)
  // // console.log('[ROUTER] from.fullPath => ', from.fullPath, ', to.fullPath =>', to.fullPath)
  // // console.log('[ROUTER] from.path => ', from.path, ', to.path =>', to.path)
  // // console.log('[ROUTER] from.query => ', from.query, ', to.query =>', to.query)
  // // console.log('[ROUTER] from.redirectedFrom => ', from.redirectedFrom, ', to.redirectedFrom =>', to.redirectedFrom)
  // console.log('[ROUTER] session info : ', router.app.$session.get('account_id'))

  // if (to.name !== 'login' && to.name !== 'intro' && !from.name) {
  //   let accountId = router.app.$session.get('account_id')
  //   if (accountId !== undefined && accountId !== null) {
  //     console.log('로그인 상태 중 페이지 새로고침 발생')
  //     const response = await authAPI.confirmAccountAuth(router.app.$session.get('account_id'))
  //     if (response.status !== 401 && response.status !== 419) {
  //       next()
  //     }
  //     else {
  //       router.app.$session.destroy()
  //     }
  //   } else {
  //     if (to.name === 'intro') {
  //       next()
  //     } else {
  //       next({
  //         name: 'login',
  //         query: { redirect: to.fullPath }
  //       })
  //     }
  //   }
  // } else {
  //   if (router.app.$session.get('account_id') === null) {
  //     next({
  //       name: 'login',
  //       query: { redirect: from.fullPath }
  //     })
  //   } else {
  //     next()
  //   }
  // }

  // if (to.name !== 'login') {
  //   const session = await router.app.$session
  //   // const jwt = await session.get('jwt')
  //   const account_id = await session.get('account_id')
  //   // const response = await authAPI.confirmAccessToken(jwt, account_id)
  //   const response = undefined
  //   if(!response) {
  //     next({
  //       name: 'login'
  //     })
  //   }
  //   if (!router.app.$http.defaults.headers.common['Authorization']) {
  //     console.log('page refresh!!')
  //     // router.app.$http.defaults.headers.common['Authorization'] = await jwt
  //     // console.log(response.account_id)
  //     await session.set('account_id', account_id)
  //   }
  //   // console.log('Auth response : ', response)
  //   if (!session.exists() ) {
  //     session.destroy()
  //     if (from.name) {
  //       console.log("토큰만료!!")
  //       // router.app.$store.dispatch('openGlobalModal', {})
  //     } else {
  //       next({
  //         name: 'login',
  //         query: {redirect: from.fullPath}
  //       })
  //     }
  //   } else {
  //     // console.log(session.get('jwt'), '세션 유효')
  //     next()
  //   }
  // } else {
  //   next()
  // }
})

export default router
