import React from "react";
import { Navigate, Outlet } from "react-router-dom";

function UnProtectedRoute() {
  const token = localStorage.getItem("token");
  // console.log(token);

  return !token ? <Outlet /> : <Navigate to="/dashboard" />;
}

export default UnProtectedRoute;
