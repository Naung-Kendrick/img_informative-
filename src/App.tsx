import { lazy, Suspense } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import PageLoader from "./components/PageLoader"
import PwaUpdater from "./components/PwaUpdater"
import OfflineBanner from "./components/OfflineBanner"
import ErrorBoundary from "./components/ErrorBoundary"
// Core Layout & Guard Components (Kept synchronous to prevent initial flash)
import Layout from "./components/Layout"
import AdminLayout from "./components/admin/AdminLayout"
import RoleGuard from "./components/admin/RoleGuard"

// 👉 Public Pages (Lazy Loaded)
const Home = lazy(() => import("./pages/Home"))
const NewsReader = lazy(() => import("./pages/NewsReader"))
const Activities = lazy(() => import("./pages/Activities"))
const Services = lazy(() => import("./pages/Services"))
const PageReader = lazy(() => import("./pages/PageReader"))
const Announcements = lazy(() => import("./pages/Announcements"))
const AnnouncementDetail = lazy(() => import("./pages/AnnouncementDetail"))
const Districts = lazy(() => import("./pages/Districts"))
const AboutPage = lazy(() => import("./pages/AboutPage"))
const Contact = lazy(() => import("./pages/Contact"))
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
const ContentReportsManagement = lazy(() => import("./pages/admin/ContentReportsManagement"))
const ActivitiesManagement = lazy(() => import("./pages/admin/ActivitiesManagement"))
const AnnouncementsManagement = lazy(() => import("./pages/admin/AnnouncementsManagement"))
const CreateAnnouncement = lazy(() => import("./pages/admin/CreateAnnouncement"))
const HotNewsManagement = lazy(() => import("./pages/admin/HotNewsManagement"))
const PageManagement = lazy(() => import("./pages/admin/PageManagement"))
const ContactManagement = lazy(() => import("./pages/admin/ContactManagement"))
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
              <Route path="contact" element={<Contact />} />
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
              {/* All roles: Dashboard, News, Profile */}
              <Route index element={<DashboardOverview />} />
              <Route path="reports" element={<ReportsManagement />} />
              <Route path="content-reports" element={<ContentReportsManagement />} />
              <Route path="news/interactions/:id" element={<NewsInteractionsManagement />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="news" element={<NewsManagement />} />
              <Route path="news/new" element={<CreateNews />} />
              <Route path="news/edit/:id" element={
                <RoleGuard minRole={2}>
                  <EditNews />
                </RoleGuard>
              } />
              <Route path="profile" element={<Profile />} />

              {/* CMS Sections (view & create) */}
              <Route path="activities" element={<ActivitiesManagement />} />
              <Route path="services" element={
                <PageManagement
                  section="services"
                  title="ဝန်ဆောင်မှုများ စီမံရန်"
                  subtitle="ဝန်ဆောင်မှုဆိုင်ရာ စာမျက်နှာများကို စီမံခန့်ခွဲပါ။"
                  emptyText="ဝန်ဆောင်မှု စာမျက်နှာများ မရှိသေးပါ။"
                />
              } />
              <Route path="districts" element={<DistrictsManagement />} />
              <Route path="districts/new" element={<CreateDistrict />} />
              <Route path="districts/edit/:id" element={<EditDistrict />} />
              <Route path="announcements" element={<AnnouncementsManagement />} />
              <Route path="announcements/new" element={<CreateAnnouncement />} />
              <Route path="about" element={<AboutManagement />} />
              <Route path="faq" element={<FaqManagement />} />
              <Route path="hotnews" element={<HotNewsManagement />} />
              <Route path="pages/new" element={<CreatePage />} />
              <Route path="pages/edit/:id" element={
                <RoleGuard minRole={2}>
                  <EditPage />
                </RoleGuard>
              } />

              {/* Admin+ only (role >= 2): Contacts & Users */}
              <Route path="contact" element={
                <RoleGuard minRole={2}>
                  <ContactManagement />
                </RoleGuard>
              } />
              <Route path="contact-info" element={
                <RoleGuard minRole={2}>
                  <ContactInfoManagement />
                </RoleGuard>
              } />
              <Route path="users" element={
                <RoleGuard minRole={2}>
                  <UserManagement />
                </RoleGuard>
              } />
              <Route path="audit-logs" element={
                <RoleGuard minRole={3}>
                  <AuditLogs />
                </RoleGuard>
              } />
              <Route path="statistics" element={<StatisticsManagement />} />
              <Route path="layout" element={
                <RoleGuard minRole={2}>
                  <LayoutManagement />
                </RoleGuard>
              } />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </>
  )
}

export default App
