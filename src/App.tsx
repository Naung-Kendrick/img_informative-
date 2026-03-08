import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Login from "./pages/Login"
import AdminLayout from "./components/admin/AdminLayout"
import RoleGuard from "./components/admin/RoleGuard"
import UserManagement from "./pages/admin/UserManagement"
import NewsManagement from "./pages/admin/NewsManagement"
import CreateNews from "./pages/admin/CreateNews"
import EditNews from "./pages/admin/EditNews"
import DashboardOverview from "./pages/admin/DashboardOverview"
import ReportsManagement from "./pages/admin/ReportsManagement"
import NewsInteractionsManagement from "./pages/admin/NewsInteractionsManagement"
import ContentReportsManagement from "./pages/admin/ContentReportsManagement"
import Home from "./pages/Home"
import NewsReader from "./pages/NewsReader"
import ActivitiesManagement from "./pages/admin/ActivitiesManagement"
import AnnouncementsManagement from "./pages/admin/AnnouncementsManagement"
import CreateAnnouncement from "./pages/admin/CreateAnnouncement"
import HotNewsManagement from "./pages/admin/HotNewsManagement"
import PageManagement from "./pages/admin/PageManagement"
import ContactManagement from "./pages/admin/ContactManagement"
import CreatePage from "./pages/admin/CreatePage"
import EditPage from "./pages/admin/EditPage"
import Profile from "./pages/admin/Profile"
import StatisticsManagement from "./pages/admin/StatisticsManagement"
import ContactInfoManagement from "./pages/admin/ContactInfoManagement"

import DistrictsManagement from "./pages/admin/DistrictsManagement"
import CreateDistrict from "./pages/admin/CreateDistrict"
import AboutManagement from "./pages/admin/AboutManagement"

import PageReader from "./pages/PageReader"
import LegalPage from "./pages/LegalPage"

// Public pages
import Activities from "./pages/Activities"
import Announcements from "./pages/Announcements"
import AnnouncementDetail from "./pages/AnnouncementDetail"
import Services from "./pages/Services"
import Districts from "./pages/Districts"
import AboutPage from "./pages/AboutPage"
import Contact from "./pages/Contact"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <BrowserRouter>
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
          <Route path="privacy-policy" element={<LegalPage />} />
          <Route path="terms-of-service" element={<LegalPage />} />
          <Route path="accessibility" element={<LegalPage />} />
          <Route path="legal/:type" element={<LegalPage />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Site Routes (AdminLayout already blocks role 0) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* All roles: Dashboard, News, Profile */}
          <Route index element={<DashboardOverview />} />
          <Route path="reports" element={<ReportsManagement />} />
          <Route path="content-reports" element={<ContentReportsManagement />} />
          <Route path="news/interactions/:id" element={<NewsInteractionsManagement />} />
          <Route path="news" element={<NewsManagement />} />
          <Route path="news/new" element={<CreateNews />} />
          <Route path="news/edit/:id" element={
            <RoleGuard minRole={2}>
              <EditNews />
            </RoleGuard>
          } />
          <Route path="profile" element={<Profile />} />

          {/* All roles: CMS Sections (view & create) */}
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
          <Route path="announcements" element={<AnnouncementsManagement />} />
          <Route path="announcements/new" element={<CreateAnnouncement />} />
          <Route path="about" element={<AboutManagement />} />
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
          <Route path="statistics" element={<StatisticsManagement />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
