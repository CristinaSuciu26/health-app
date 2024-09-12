import React from "react";
import styles from "./UserInfo.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectToken } from "../../redux/auth/authSelectors";
import { logout } from "../../redux/auth/authOperations";
import RightSideBar from "../rightSideBar/RightSideBar.jsx";

const UserInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);
  const token = useSelector(selectToken);

  const handleLogout = async () => {
    try {
      await dispatch(logout(token)).unwrap();

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav>
      <ul className={styles.navLinkContainer}>
        <li className={styles.navLink}>
          <p>{user?.name}</p>
        </li>
        <li className={styles.navLink}>
          <button onClick={handleLogout}>Exit</button>
        </li>
      </ul>
      <RightSideBar />
    </nav>
  );
};

export default UserInfo;
