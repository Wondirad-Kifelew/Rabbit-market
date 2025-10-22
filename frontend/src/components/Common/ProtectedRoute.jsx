import React, { useContext } from "react";
import { AppContext } from "../../context/AppContextHelper";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user } = useContext(AppContext);
  if (!user || (role && user.role !== role)) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
