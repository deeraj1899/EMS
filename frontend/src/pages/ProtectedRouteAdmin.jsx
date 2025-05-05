import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export const ProtectedRouteAdmin = ({ children }) => {
  const  isAuthenticated  = useSelector((store) => store.auth.isAuthenticated);
const employeestatus=useSelector((store)=>store.auth.employee.Employeestatus)
  if (!isAuthenticated || employeestatus==='Employee') {
    return <Navigate to="/" />;
  }

  return children;
};
