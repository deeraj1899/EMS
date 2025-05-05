import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import { Toaster } from 'react-hot-toast' 
import LoginasEmp from './pages/LoginasEmployee';
import PricingPlan from './pages/PricingPlan';
import CreateOrganizationForm from './pages/CreateOrganizationForm';
import EmployeeHome from './pages/Employeepages/EmployeeHome';
import Works from './pages/Employeepages/Works';
import AdminLogin from './pages/Employeepages/AdminLogin';
import AdminHome from './pages/AdminPages/AdminHome';
import AddEmployee from './pages/AdminPages/AddEmployee';
import DeleteEmployee from './pages/AdminPages/DeleteEmployee';
import Addwork from './pages/AdminPages/Addwork';
import PromoteEmployee from './pages/AdminPages/PromoteEmployee';
import Settings from './pages/Employeepages/Settings';
import ReviewWork from './pages/AdminPages/ReviewWork';
import WorkReview from './pages/AdminPages/WorkReview';
import EmployeeReviewWork from './pages/Employeepages/EmployeeReviewWork';
import WorkReviewEmp from './pages/Employeepages/WorkReviewEmp';
import MarkAttendance from './pages/Employeepages/MarkAttendance';
import AttendanceRecords from './pages/Employeepages/AttendanceRecords';
import ViewAttendance from './pages/AdminPages/ViewAttendance';
import EmployeeAttendanceRecords from './pages/AdminPages/EmployeeAttendanceRecords';
import LeaveRequest from './pages/Employeepages/LeaveRequest';
import ApproveLeaveRequests from './pages/AdminPages/ApproveLeaveRequests';
import EmployeeLeaveStatus from './pages/Employeepages/EmployeeLeaveStatus';
import SuperAdmin from './pages/AdminPages/SuperAdmin';
import SuperAdminRevenue from './pages/AdminPages/SuperAdminRevenue';
import SuperAdminLogin from './pages/AdminPages/SuperAdminLogin';
import ForgotPassword from './pages/Employeepages/ForgotPassword';

import { ProtectedRoute } from './pages/ProtectedRoute';
import { ProtectedRouteAdmin } from './pages/ProtectedRouteAdmin';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home/>
  },
  {
    path:'/LoginasEmployee',
    element:<LoginasEmp/>
  },
  {
    path:'/forgotpassword',
    element:<ForgotPassword/>

  },
  {
    path: '/PricingPlan',
    element: <PricingPlan/>
  },
  {
    path: '/create-organization',
    element: <CreateOrganizationForm />
  },
  {
    path:'/employee-dashboard',
    element:<ProtectedRoute><EmployeeHome/></ProtectedRoute>
  },
  {
    path:'/EmployeeHome/Works',
    element:<ProtectedRoute><Works/></ProtectedRoute>
  },
  {
    path:'/EmployeeHome/reviews',
    element:<ProtectedRoute><EmployeeReviewWork/></ProtectedRoute>
  },
  {
    path:'/EmployeeHome/review-work/review',
    element:<ProtectedRoute><WorkReviewEmp/></ProtectedRoute>
  },
  {
    path: '/EmployeeHome/mark-attendance',
    element:<ProtectedRoute><MarkAttendance/></ProtectedRoute>
  },
  {
    path: '/EmployeeHome/attendance-records',
    element:<ProtectedRoute><AttendanceRecords/></ProtectedRoute>
  },
  {
    path: '/EmployeeHome/leave-request',
    element:<ProtectedRoute><LeaveRequest/></ProtectedRoute>
  
  },
  {
    path: '/EmployeeHome/leavestatus',
    element:<ProtectedRoute><EmployeeLeaveStatus/></ProtectedRoute>
   
  },
  {
    path:'/EmployeeHome/adminLogin',
    element:<ProtectedRoute><AdminLogin/></ProtectedRoute>
  },

  {
    path:'/adminDashboard',
    // element:<ProtectedRouteAdmin><AdminHome/></ProtectedRouteAdmin>
    element:<AdminHome/>
  },

  {
    path:'/adminHome/add-employee',
    element:<ProtectedRouteAdmin><AddEmployee/></ProtectedRouteAdmin>
  },
  {
    path:'/adminHome/delete-employee',
    element:<ProtectedRouteAdmin><DeleteEmployee/></ProtectedRouteAdmin>
  },
  {
    path:'/adminHome/add-work',
    element:<ProtectedRouteAdmin><Addwork/></ProtectedRouteAdmin>
  },
  {
    path:'/adminHome/promote-employee',
    element:<ProtectedRouteAdmin><PromoteEmployee/></ProtectedRouteAdmin>
  },
  {
    path:'/EmployeeHome/Settings',
    element:<ProtectedRoute><Settings/></ProtectedRoute>
  },
  {
    path:'/adminHome/review-work',
    element:<ProtectedRouteAdmin><ReviewWork/></ProtectedRouteAdmin>
  },
  {
    path:'/adminHome/review-work/review',
    element:<ProtectedRouteAdmin><WorkReview/></ProtectedRouteAdmin>
  },
  {
    path: '/adminHome/view-attendance',
    element:<ProtectedRouteAdmin><ViewAttendance/></ProtectedRouteAdmin>

  },
  {
    path: '/adminHome/view-attendance-records',
    element:<ProtectedRouteAdmin><EmployeeAttendanceRecords/></ProtectedRouteAdmin>
  },
  {
    path: '/adminHome/approve-leave',
    element:<ProtectedRouteAdmin><ApproveLeaveRequests/></ProtectedRouteAdmin>
    
  },
  {
    path: '/SuperAdmin/dashboard',
    element:<ProtectedRouteAdmin><SuperAdmin/></ProtectedRouteAdmin>
    // element: <SuperAdmin/>
  
  },
    {
      path: '/SuperAdmin/dashboard/revenue',
      element:<ProtectedRouteAdmin><SuperAdminRevenue/></ProtectedRouteAdmin>
      // element: <SuperAdminRevenue/>

    },
    {
      path: '/SuperAdminLogin',
      // element: <SuperAdminLogin/>
      element:<ProtectedRoute><SuperAdminLogin/></ProtectedRoute>
    }
  
]);

const App = () => {
  return (
    <div className='min-h-screen'>
      <RouterProvider router={router}/>
      <Toaster/>
    </div>
  )
}

export default App
