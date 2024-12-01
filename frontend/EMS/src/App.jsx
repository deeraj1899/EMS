import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './Pages/Home';
import CreateOrganizationForm from './Pages/CreateOrganizationForm';
import AdminForm from './Pages/AdminForm';
import LoginasEmp from './Pages/LoginasEmp';
import EmployeeHome from './Pages/Employeepages/EmployeeHome';
import Settings from './Pages/Employeepages/Settings';
import AdminLogin from './Pages/Employeepages/AdminLogin';
import AdminHome from './Pages/AdminPages/AdminHome';
import AddEmployee from './Pages/AdminPages/AddEmployee';
import DeleteEmployee from './Pages/AdminPages/DeleteEmployee';
import PromoteEmployee from './Pages/AdminPages/PromoteEmployee';
import AddWork from './Pages/AdminPages/AddWork';
import Works from './Pages/Employeepages/Works';
import ReviewWork from './Pages/AdminPages/ReviewWork';
import WorkReview from './Pages/AdminPages/WorkReview';
import SubmittedWorkreview from './Pages/Employeepages/SubmittedWorkreview';
import EmpWorkReview from './Pages/Employeepages/EmpWorkReview';
import ProtectedRoute from './Pages/AdminPages/ProtectedRoute';

const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/create-organization',
    element: <CreateOrganizationForm />
  },
  {
    path: '/adminform',
    element: <AdminForm />
  },
  {
    path: '/LoginasEmp',
    element: <LoginasEmp />
  },
  {
    path: '/EmployeeHome',
    element: <EmployeeHome />
  },
  {
    path: '/EmployeeHome/Settings',
    element: <Settings />
  },
  {
    path: '/EmployeeHome/Works',
    element: <Works />
  },
  {
    path: '/EmployeeHome/adminLogin',
    element: <AdminLogin />
  },
  {
    path: '/EmployeeHome/reviews',
    element: <SubmittedWorkreview/>
  },
  {
    path: '/EmployeeHome/review-work/:work-id',
    element: <EmpWorkReview/>
  },
  {
    path: '/adminHome/:id',
    element: <ProtectedRoute><AdminHome /></ProtectedRoute>,
  },
  {
    path: '/adminHome/add-employee/:id',
    element:<ProtectedRoute><AddEmployee /></ProtectedRoute>,
  },
  {
    path: '/adminHome/delete-employee/:id',
    element: <ProtectedRoute><DeleteEmployee/></ProtectedRoute>,
  },
  {
    path: '/adminHome/promote-employee/:id',
    element: <ProtectedRoute><PromoteEmployee/></ProtectedRoute>,
  },
  {
    path: '/adminHome/add-work/:id',
    element: <ProtectedRoute><AddWork/></ProtectedRoute>,
  }, 
  {
    path: '/adminHome/review-work/:id',
    element: <ProtectedRoute><ReviewWork/></ProtectedRoute>,
  },
  {
    path: '/adminHome/review-work/:id/review',
    element: <ProtectedRoute><WorkReview/></ProtectedRoute>,
  } 
]);

const App = () => {
  return (
    <RouterProvider router={appRouter} />
  );
};

export default App;
