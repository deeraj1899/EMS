import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { Employee } = useSelector((store) => store.employee.employeeData);
  const navigate = useNavigate();
  useEffect(() => {
    if (Employee === null || Employee.Employeestatus === 'Employee') {
      navigate("/");
    }
  }, [Employee, navigate]);

  return (
    <>
      {children}
    </>
  );
};

export default ProtectedRoute;
