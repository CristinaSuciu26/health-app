import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { selectIsLoggedIn } from "./redux/auth/authSelectors";

const PrivateRoute = ({ element }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  return isLoggedIn ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
