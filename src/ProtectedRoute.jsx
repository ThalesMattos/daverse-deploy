import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ requiredRole, children }) => {
  const userRole = localStorage.getItem('role');

  if (!userRole || userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;