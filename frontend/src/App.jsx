import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Common Pages
import Login from './pages/common/Login';
import Home from './pages/common/Home';
import CompleteProfile from './pages/common/CompleteProfile';
import About from './pages/common/About';

// Admin
import AdminUsers from './pages/admin/AdminUsers';
import AdminMatches from './pages/admin/AdminMatches';
import AdminSessions from './pages/admin/AdminSessions';
import AdminLayout from './layouts/AdminLayout';

// Mentor
import MentorDashboard from './pages/mentor/MentorDashboard';
import MentorLayout from './layouts/MentorLayout';
import Availability from './pages/mentor/Availability';
import Requests from './pages/mentor/Requests';
import Sessions from './pages/mentor/Sessions';

// Mentee
import MenteeLayout from './layouts/MenteeLayout';
import MenteeDashboard from './pages/mentee/MenteeDashboard';
import MyRequests from './pages/mentee/MyRequests';
import MySessions from './pages/mentee/MySessions';
import Profile from './pages/mentee/Profile';
import Mentors from './pages/mentee/Mentors';
import MentorDetail from './pages/mentee/MentorDetail';

// Shared
import Layout from './layouts/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      <Routes>
        {/* Public/Common Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="profile/edit" element={<CompleteProfile />} />
          <Route path="about" element={<About />} />
        </Route>

        {/* Admin Routes - Separated Correctly */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminUsers />} />
        </Route>

        <Route
          path="/admin/matches"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminMatches />} />
        </Route>

        <Route
          path="/admin/sessions"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminSessions />} />
        </Route>

        {/* Mentor Routes */}
        <Route
          path="/mentor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['mentor']}>
              <MentorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MentorDashboard />} />
          <Route path="availability" element={<Availability />} />
          <Route path="requests" element={<Requests />} />
          <Route path="sessions" element={<Sessions />} />
        </Route>

        {/* Mentee Routes */}
        <Route
          path="/mentee/dashboard"
          element={
            <ProtectedRoute allowedRoles={['mentee']}>
              <MenteeLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MenteeDashboard />} />
          <Route path="my-requests" element={<MyRequests />} />
          <Route path="my-sessions" element={<MySessions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="mentors" element={<Mentors />} />
          <Route path="mentors/:speciality" element={<Mentors />} />
          <Route path="mentor/:id" element={<MentorDetail />} />
        </Route>
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
