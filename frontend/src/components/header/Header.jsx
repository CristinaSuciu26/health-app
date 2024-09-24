import React from "react";
import LogoComponent from "../logo/Logo.jsx";
import styles from "./Header.module.css";
import UserInfo from "../userInfo/UserInfo.jsx";
import Navigation from "../navigation/Navigation.jsx";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/authSelectors.js";

const Header = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <div className={styles.header}>
      <div
        className={`${styles.headerContent} ${
          isLoggedIn ? styles.loggedIn : styles.loggedOut
        }`}
      >
        <LogoComponent />
        {isLoggedIn ? <UserInfo /> : <Navigation />}
      </div>
    </div>
  );
};

export default Header;
