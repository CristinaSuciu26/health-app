import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo/logo.svg";
import logo2 from "../../assets/images/logo/logo2.svg";
import Vector from "../../assets/images/logo/Vector.svg";
import styles from "./Logo.module.css";

const LogoComponent = () => {
  const navigate = useNavigate();

  const handleMainPageClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.logoContainer} onClick={handleMainPageClick}>
      <img className={styles.logo} src={logo2} alt="Logo" />
      <img className={styles.logoMobile} src={logo} alt="Logo" />
      <img className={styles.vector} src={Vector} alt="Logo" />
    </div>
  );
};

export default LogoComponent;
