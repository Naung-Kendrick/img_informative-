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
import Home from "./pages/Home"
import NewsReader from "./pages/NewsReader"
import ActivitiesManagement from "./pages/admin/ActivitiesManagement"
import AnnouncementsManagement from "./pages/admin/AnnouncementsManagement"
import HotNewsManagement from "./pages/admin/HotNewsManagement"
import PageManagement from "./pages/admin/PageManagement"
import ContactManagement from "./pages/admin/ContactManagement"
import CreatePage from "./pages/admin/CreatePage"
import EditPage from "./pages/admin/EditPage"
import Profile from "./pages/admin/Profile"

import PageReader from "./pages/PageReader"

// Public pages
import Activities from "./pages/Activities"
import Announcements from "./pages/Announcements"
import Services from "./pages/Services"
import Districts from "./pages/Districts"
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
          <Route path="contact" element={<Contact />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Site Routes (AdminLayout already blocks role 0) */}
        <Route path="/admin" element={<AdminLayout />}>
          {/* All roles: Dashboard, News, Profile */}
          <Route index element={<DashboardOverview />} />
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
          <Route path="districts" element={
            <PageManagement
              section="districts"
              title="ခရိုင်များ စီမံရန်"
              subtitle="ခရိုင်ဆိုင်ရာ အချက်အလက်များကို စီမံခန့်ခွဲပါ။"
              emptyText="ခရိုင်ဆိုင်ရာ စာမျက်နှာများ မရှိသေးပါ။"
            />
          } />
          <Route path="announcements" element={<AnnouncementsManagement />} />
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
          <Route path="users" element={
            <RoleGuard minRole={2}>
              <UserManagement />
            </RoleGuard>
          } />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      </BrowserRouter>
  )
}

export default App
