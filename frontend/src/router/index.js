import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import Signup from '../views/signup.vue'
import ForgotPassword from '../views/forgot-pass.vue'
import Home from '../views/Home.vue'
// import Dashboard from '@/views/Dashboard.vue'
import policies from '@/views/policies.vue'
import about from '@/views/about.vue'
// import AuthorHome from '@/views/Dashboard/Author/AuthorHome.vue'
//هذا جزء الاوثر
const AuthorDashboard = () => import('../views/Dashboard/Author/AuthorDashborad.vue');
const AuthorHome = () => import('../views/Dashboard/Author/AuthorHome.vue');
const CreateResearch = () => import('../views/Dashboard/Author/CreateResearch.vue');
const MyResearch = () => import('../views/Dashboard/Author/MyResearch.vue');
// هذا جزء لايدتور 
const EditorDashboard = () => import('../views/Dashboard/Editor/EditorDashboard.vue');
const EditorHome = () => import('../views/Dashboard/Editor/EditorHome.vue');
const AllResearch = () => import('../views/Dashboard/Editor/AllResearch.vue');
const SendForReview = () => import('../views/Dashboard/Editor/SendResearchForReview.vue');
const FinalDecision = () => import('../views/Dashboard/Editor/FinalDecision.vue');
const ResearcherPromotion = () => import('../views/Dashboard/Editor/ResearcherPromotion.vue');
const VisitorReviews = () => import('../views/Dashboard/Editor/VisitorReviews.vue');
// هذا جزء الريفيور


const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: Home,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
  },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  // { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/policies', name: 'policies', component: policies },
  { path: '/about', name: 'about', component: about },
  { 
    path: '/author', 
    component: AuthorDashboard, // 1. الأب يتحمل أول اشي
    meta: { requiresAuth: true, role: 'researcher' },
    children: [
      {
        path: '', // 2. لما الرابط يكون /author بس، حمل الابن (Home)
        name: 'AuthorHome',
        component: AuthorHome
      },
       { 
        path: 'create', 
        name: 'CreateResearch',
        component: CreateResearch 
      }, 
      {
        path: 'my-research',
        name: 'MyResearch',
        component: MyResearch
      }
    ]
  },
  {
    path: '/editor',
    component: EditorDashboard,
    meta: { requiresAuth: true, role: 'editor' },
    children: [
      {
        path: '',
        name: 'EditorHome',
        component: EditorHome
      },
      { 
        path: 'all-research', 
        name: 'AllResearch', 
        component: AllResearch 
      },
      { 
        path: 'send-for-review', 
        name: 'SendForReview', 
        component: SendForReview 
      },
      { 
        path: 'final-decision', 
        name: 'FinalDecision', 
        component: FinalDecision 
      },
      { 
        path: 'promotion', 
        name: 'ResearcherPromotion', 
        component: ResearcherPromotion 
      },
      { 
        path: 'visitor-reviews', 
        name: 'VisitorReviews', 
        component: VisitorReviews 
      },
    
    ]
  }
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem('token'); 

//   if (to.meta.requiresAuth && !token) {
//     next({ name: 'Login' }); 
//   } 
//   else if (to.meta.guest && token) {
//     next({ name: 'home' });
//   }
//   else {
//     next(); 
//   }
// });
export default router