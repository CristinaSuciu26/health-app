import { useEffect } from "react";
import {
  setAuthHeader,
  refreshUserToken,
} from "../../redux/auth/authOperations";
import { useDispatch } from "react-redux";

function AuthWrapper({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      setAuthHeader(accessToken);
    }

    if (refreshToken) {
      dispatch(refreshUserToken());
    }
  }, [dispatch]);

  return <>{children}</>;
}

export default AuthWrapper;
