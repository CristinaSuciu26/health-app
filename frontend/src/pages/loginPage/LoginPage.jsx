import React from "react";
import styles from "./LoginPage.module.css";
import leafs from "../../assets/images/leafs.png";
import leafsDesktop from "../../assets/images/leafs-desktop.png";
import layer from "../../assets/images/layer.png";
import layerDesktop from "../../assets/images/layer-desktop.png";
import banana from "../../assets/images/banana.png";
import bananaDesktop from "../../assets/images/banana-desktop.png";
import strawberry from "../../assets/images/strawberry.png";
import strawberryDesktop from "../../assets/images/strawberry-desktop.png";
import LoginForm from "../../components/loginForm/LoginForm.jsx";
import ImagesComponent from "../../components/imagesComponent/imagesComponent.jsx";

const LoginPage = () => {
  const images = [
    {
      src: leafs,
      srcDesktop: leafsDesktop,
      alt: "Leafs",
      className: `${styles.leafsLogin}`,
    },
    {
      src: layer,
      srcDesktop: layerDesktop,
      alt: "Layer",
      className: `${styles.layerLogin}`,
    },
    {
      src: banana,
      srcDesktop: bananaDesktop,
      alt: "Banana",
      className: `${styles.bananaLogin}`,
    },
    {
      src: strawberry,
      srcDesktop: strawberryDesktop,
      alt: "Strawberry",
      className: `${styles.strawberryLogin}`,
    },
  ];

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <LoginForm />
        <ImagesComponent images={images} />
      </div>
    </div>
  );
};

export default LoginPage;
