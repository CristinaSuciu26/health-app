import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo/logo.svg";
import logo2 from "../../assets/images/logo/logo2.svg";
import Vector from "../../assets/images/logo/Vector.svg";
import styles from "./Logo.module.css";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/authSelectors";

const LogoComponent = () => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleMainPageClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.logoContainer} onClick={handleMainPageClick}>
      <img className={styles.primaryLogo} src={logo2} alt="Primary Logo" />
      <img 
        className={`${styles.secondaryLogo} ${isLoggedIn ? styles.loggedIn : styles.loggedOut}`}
        src={logo}
        alt="Logo"
      />
      <img className={styles.vectorIcon} src={Vector} alt="Vector" />
    </div>
  );
};

export default LogoComponent;
