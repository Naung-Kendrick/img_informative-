import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import PageLoader from "./components/PageLoader"
import AnalyticsWrapper from "./components/AnalyticsWrapper"
import PwaUpdater from "./components/PwaUpdater"
import OfflineBanner from "./components/OfflineBanner"
import ErrorBoundary from "./components/ErrorBoundary"
// Core Layout & Guard Components (Kept synchronous to prevent initial flash)
import Layout from "./components/Layout"
import AdminLayout from "./components/admin/AdminLayout"
import RoleGuard from "./components/admin/RoleGuard"
import Home from "./pages/Home"

// 👉 Public Pages (Lazy Loaded)
const NewsReader = lazy(() => import("./pages/NewsReader"))
const Activities = lazy(() => import("./pages/Activities"))
const Services = lazy(() => import("./pages/Services"))
const PageReader = lazy(() => import("./pages/PageReader"))
const Announcements = lazy(() => import("./pages/Announcements"))
const AnnouncementDetail = lazy(() => import("./pages/AnnouncementDetail"))
const Districts = lazy(() => import("./pages/Districts"))
const AboutPage = lazy(() => import("./pages/AboutPage"))
const HelpCenter = lazy(() => import("./pages/HelpCenter"))
const LegalPage = lazy(() => import("./pages/LegalPage"))
const Login = lazy(() => import("./pages/Login"))
const NotFound = lazy(() => import("./pages/NotFound"))

// 👉 Admin Pages (Lazy Loaded - Separated for chunking)
const DashboardOverview = lazy(() => import("./pages/admin/DashboardOverview"))
const UserManagement = lazy(() => import("./pages/admin/UserManagement"))
const NewsManagement = lazy(() => import("./pages/admin/NewsManagement"))
const CreateNews = lazy(() => import("./pages/admin/CreateNews"))
const EditNews = lazy(() => import("./pages/admin/EditNews"))
const ReportsManagement = lazy(() => import("./pages/admin/ReportsManagement"))
const NewsInteractionsManagement = lazy(() => import("./pages/admin/NewsInteractionsManagement"))
const ActivitiesManagement = lazy(() => import("./pages/admin/ActivitiesManagement"))
const AnnouncementsManagement = lazy(() => import("./pages/admin/AnnouncementsManagement"))
const CreateAnnouncement = lazy(() => import("./pages/admin/CreateAnnouncement"))
const HotNewsManagement = lazy(() => import("./pages/admin/HotNewsManagement"))
const PageManagement = lazy(() => import("./pages/admin/PageManagement"))
const ContactInfoManagement = lazy(() => import("./pages/admin/ContactInfoManagement"))
const FaqManagement = lazy(() => import("./pages/admin/FaqManagement"))
const CreatePage = lazy(() => import("./pages/admin/CreatePage"))
const EditPage = lazy(() => import("./pages/admin/EditPage"))
const Profile = lazy(() => import("./pages/admin/Profile"))
const StatisticsManagement = lazy(() => import("./pages/admin/StatisticsManagement"))
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"))
const CategoryManagement = lazy(() => import("./pages/admin/CategoryManagement"))
const DistrictsManagement = lazy(() => import("./pages/admin/DistrictsManagement"))
const CreateDistrict = lazy(() => import("./pages/admin/CreateDistrict"))
const EditDistrict = lazy(() => import("./pages/admin/EditDistrict"))
const AboutManagement = lazy(() => import("./pages/admin/AboutManagement"))
const LayoutManagement = lazy(() => import("./pages/admin/LayoutManagement"))

/**
 * Optimized Routing System
 * 🛠️ Implements Route-level Code Splitting using React.lazy and Suspense.
 * 🚀 Goal: Reduce initial JS payload by only loading what's visible.
 */
function App() {
  return (
    <>
      <PwaUpdater />
      <OfflineBanner />
      <BrowserRouter>
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            <Routes>
            {/* Public / Client Site Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="news/:id" element={<NewsReader />} />
              <Route path="news" element={<Home />} />
              <Route path="activities" element={<Activities />} />
              <Route path="services" element={<Services />} />
              <Route path="services/:id" element={<PageReader />} />
              <Route path="districts" element={<Districts />} />
              <Route path="districts/:id" element={<PageReader />} />
              <Route path="announcements" element={<Announcements />} />
              <Route path="announcements/:id" element={<AnnouncementDetail />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="contact" element={<Navigate to="/" replace />} />
              <Route path="help-center" element={<HelpCenter />} />
              <Route path="privacy-policy" element={<LegalPage />} />
              <Route path="terms-of-service" element={<LegalPage />} />
              <Route path="accessibility" element={<LegalPage />} />
              <Route path="legal/:type" element={<LegalPage />} />
              <Route path="login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Admin Site Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              {/* All roles (1+): Dashboard, Profile */}
              <Route index element={<DashboardOverview />} />
              <Route path="profile" element={<Profile />} />

              {/* Admin (role 2+): News, Activities, Reports */}
              <Route path="reports" element={<ReportsManagement />} />
              <Route path="news" element={<NewsManagement />} />
              <Route path="news/new" element={<CreateNews />} />
              <Route path="news/interactions/:id" element={<NewsInteractionsManagement />} />
              <Route path="news/edit/:id" element={<EditNews />} />
              <Route path="activities" element={<ActivitiesManagement />} />

              {/* Root Admin (role 3) only — all other CMS & management */}
              <Route path="categories" element={
                <RoleGuard minRole={3}>
                  <CategoryManagement />
                </RoleGuard>
              } />
              <Route path="hotnews" element={
                <RoleGuard minRole={3}>
                  <HotNewsManagement />
                </RoleGuard>
              } />
              <Route path="services" element={
                <RoleGuard minRole={3}>
                  <PageManagement
                    section="services"
                    title="ဝန်ဆောင်မှုများ စီမံရန်"
                    subtitle="ဝန်ဆောင်မှုဆိုင်ရာ စာမျက်နှာများကို စီမံခန့်ခွဲပါ။"
                    emptyText="ဝန်ဆောင်မှု စာမျက်နှာများ မရှိသေးပါ။"
                  />
                </RoleGuard>
              } />
              <Route path="districts" element={
                <RoleGuard minRole={3}>
                  <DistrictsManagement />
                </RoleGuard>
              } />
              <Route path="districts/new" element={
                <RoleGuard minRole={3}>
                  <CreateDistrict />
                </RoleGuard>
              } />
              <Route path="districts/edit/:id" element={
                <RoleGuard minRole={3}>
                  <EditDistrict />
                </RoleGuard>
              } />
              <Route path="announcements" element={
                <RoleGuard minRole={3}>
                  <AnnouncementsManagement />
                </RoleGuard>
              } />
              <Route path="announcements/new" element={
                <RoleGuard minRole={3}>
                  <CreateAnnouncement />
                </RoleGuard>
              } />
              <Route path="about" element={
                <RoleGuard minRole={3}>
                  <AboutManagement />
                </RoleGuard>
              } />
              <Route path="faq" element={
                <RoleGuard minRole={3}>
                  <FaqManagement />
                </RoleGuard>
              } />
              <Route path="pages/new" element={
                <RoleGuard minRole={3}>
                  <CreatePage />
                </RoleGuard>
              } />
              <Route path="pages/edit/:id" element={
                <RoleGuard minRole={3}>
                  <EditPage />
                </RoleGuard>
              } />
              <Route path="statistics" element={
                <RoleGuard minRole={3}>
                  <StatisticsManagement />
                </RoleGuard>
              } />
              <Route path="layout" element={
                <RoleGuard minRole={3}>
                  <LayoutManagement />
                </RoleGuard>
              } />
              <Route path="contact" element={<Navigate to="/admin" replace />} />
              <Route path="contact-info" element={
                <RoleGuard minRole={3}>
                  <ContactInfoManagement />
                </RoleGuard>
              } />
              <Route path="users" element={
                <RoleGuard minRole={3}>
                  <UserManagement />
                </RoleGuard>
              } />
              <Route path="audit-logs" element={
                <RoleGuard minRole={3}>
                  <AuditLogs />
                </RoleGuard>
              } />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
      <AnalyticsWrapper />
    </>
  )
}

export default App
