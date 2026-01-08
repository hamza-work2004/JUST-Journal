import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/login.vue'
import Signup from '../views/signup.vue'
import ForgotPassword from '../views/forgot-pass.vue'
import Home from '../views/Home.vue'
import Dashboard from '@/views/Dashboard/Dashboard.vue'
import policies from '@/views/policies.vue'
import about from '@/views/about.vue'


// --- Lazy Loading Components ---
// Author
const AuthorDashboard = () => import('../views/Dashboard/Author/AuthorDashborad.vue');
const AuthorHome = () => import('../views/Dashboard/Author/AuthorHome.vue');
const CreateResearch = () => import('../views/Dashboard/Author/CreateResearch.vue');
const MyResearch = () => import('../views/Dashboard/Author/MyResearch.vue');
const CreateFeedback = () => import('../views/Dashboard/Author/CreateFeedback.vue');
const Notifications = () => import('../views/Dashboard/Author/Notifications.vue');

// Editor
const EditorDashboard = () => import('../views/Dashboard/Editor/EditorDashboard.vue');
const EditorHome = () => import('../views/Dashboard/Editor/EditorHome.vue');
const AllResearch = () => import('../views/Dashboard/Editor/AllResearch.vue');
const SendForReview = () => import('../views/Dashboard/Editor/SendResearchForReview.vue');
const FinalDecision = () => import('../views/Dashboard/Editor/FinalDecision.vue');
const ResearcherPromotion = () => import('../views/Dashboard/Editor/ResearcherPromotion.vue');
const VisitorReviews = () => import('../views/Dashboard/Editor/VisitorReviews.vue');

// Reviewer
const ReviewerDashboard = () => import('../views/Dashboard/Reviewer/ReviewerDashboard.vue');
const ReviewerHome = () => import('../views/Dashboard/Reviewer/ReviewerHome.vue');
const ReviewPapers = () => import('../views/Dashboard/Reviewer/ReviewPapers.vue');

import Profile from '@/views/Profile.vue'

const routes = [
  { 
    path: '/', 
    name: 'home', 
    component: Home,
    // شيلنا الحماية عن الهوم عشان يقدر يشوفها أي حدا (اختياري)
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
  },
  { path: '/signup', name: 'Signup', component: Signup },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/policies', name: 'policies', component: policies },
  { path: '/about', name: 'about', component: about },
  
  // --- Author Routes ---
  { 
    path: '/author', 
    component: AuthorDashboard, 
    // 👇 تعديل مهم: الاسم لازم يطابق الباك اند (author)
    meta: { requiresAuth: true, role: 'author' }, 
    children: [
      {
        path: '', 
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
      },
      {
        path: 'feedback',
        name: 'CreateFeedback',
        component: CreateFeedback
      },
      {
        path: 'notifications',
        name: 'Notifications',
        component: Notifications
      },
      {
        path: 'profile',
        name: 'Profile',
        component: Profile
      }
      
    ]
  },

  // --- Editor Routes ---
  {
    path: '/editor',
    component: EditorDashboard,
    meta: { requiresAuth: true, role: 'editor' },
    children: [
      { path: '', name: 'EditorHome', component: EditorHome },
      { path: 'all-research', name: 'AllResearch', component: AllResearch },
      { path: 'send-for-review', name: 'SendForReview', component: SendForReview },
      { path: 'final-decision', name: 'FinalDecision', component: FinalDecision },
      { path: 'promotion', name: 'ResearcherPromotion', component: ResearcherPromotion },
      { path: 'visitor-reviews', name: 'VisitorReviews', component: VisitorReviews },
    ]
  },

  // --- Reviewer Routes ---
  {
    path: '/reviewer',
    component: ReviewerDashboard,
    meta: { requiresAuth: true, role: 'reviewer' },
    children: [
      { path: '', name: 'ReviewerHome', component: ReviewerHome },
      { path: 'review-papers', name: 'ReviewPapers', component: ReviewPapers },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// --- تفعيل الحماية (Guard) ---
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); 
  const userRole = localStorage.getItem('userRole');

  // 1. هل الصفحة تتطلب تسجيل دخول؟
  if (to.meta.requiresAuth) {
    if (!token) {
      // فش توكن؟ ع اللوج ان
      return next({ name: 'Login' });
    }

    // 2. هل الرتبة مطابقة؟
    // اذا الصفحة الها رتبة محددة، والرتبة تبعت المستخدم مش نفسها
    if (to.meta.role && to.meta.role !== userRole) {
      // رجعه لصفحته الصحيحة حسب رتبته عشان ما يضيع
      if(userRole === 'author') return next('/author');
      if(userRole === 'editor') return next('/editor');
      if(userRole === 'reviewer') return next('/reviewer');
      return next('/'); // احتياط
    }
  }
  
  // 3. منع الدخول لصفحة اللوج ان اذا هو أصلاً مسجل دخول
  if (to.name === 'Login' && token) {
     if(userRole === 'author') return next('/author');
     if(userRole === 'editor') return next('/editor');
     if(userRole === 'reviewer') return next('/reviewer');
  }

  next(); // اسمح بالمرور
});

export default router