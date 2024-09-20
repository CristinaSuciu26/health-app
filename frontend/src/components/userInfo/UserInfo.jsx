import React from "react";
import styles from "./UserInfo.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectToken } from "../../redux/auth/authSelectors";
import { logout } from "../../redux/auth/authOperations";
import RightSideBar from "../rightSideBar/RightSideBar.jsx";
import Vector from "../../assets/images/logo/Vector.svg";

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
      <RightSideBar user={user} handleLogout={handleLogout} />
      <div className={styles.userInfoContainer}>
        <ul className={styles.navLinkContainer}>
          <li className={styles.navLink}>
            <p>{user?.name}</p>
          </li>
          <img className={styles.vector} src={Vector} alt="Logo" />
          <li className={styles.navLink}>
            <button onClick={handleLogout} className={styles.exitBtn}>
              Exit
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default UserInfo;
