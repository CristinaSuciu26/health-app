import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo/logo.svg";
import Vector from "../../assets/images/logo/Vector.svg";
import styles from "./Logo.module.css";

const LogoComponent = () => {
  const navigate = useNavigate();

  const handleMainPageClick = () => {
    navigate("/");
  };

  return (
    <div className={styles.logoContainer} onClick={handleMainPageClick}>
      <img className={styles.logo} src={logo} alt="Logo" />
      <span className={styles.logoText}>
        Slim<span className={styles.logoTextHighlight}>Mom</span>
      </span>
      <img className={styles.vector} src={Vector} alt="Logo" />
    </div>
  );
};

export default LogoComponent;
