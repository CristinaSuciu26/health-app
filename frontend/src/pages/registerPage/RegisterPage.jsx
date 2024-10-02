import React from "react";
import styles from "./RegisterPage.module.css";
import leafs from "../../assets/images/leafs.png";
import leafsDesktop from "../../assets/images/leafs-desktop.png";
import layer from "../../assets/images/layer.png";
import layerDesktop from "../../assets/images/layer-desktop.png";
import banana from "../../assets/images/banana.png";
import bananaDesktop from "../../assets/images/banana-desktop.png";
import strawberry from "../../assets/images/strawberry.png";
import strawberryDesktop from "../../assets/images/strawberry-desktop.png";
import RegisterForm from "../../components/registerForm/RegisterForm.jsx";
import ImagesComponent from "../../components/imagesComponent/imagesComponent.jsx";

const RegisterPage = () => {
  const images = [
    {
      src: leafs,
      srcDesktop: leafsDesktop,
      alt: "Leafs",
      className: `${styles.leafsRegister}`,
    },
    {
      src: layer,
      srcDesktop: layerDesktop,
      alt: "Layer",
      className: `${styles.layerRegister}`,
    },
    {
      src: banana,
      srcDesktop: bananaDesktop,
      alt: "Banana",
      className: `${styles.bananaRegister}`,
    },
    {
      src: strawberry,
      srcDesktop: strawberryDesktop,
      alt: "Strawberry",
      className: `${styles.strawberryRegister}`,
    },
  ];
  return (
    <div className={styles.registerContainer}>
      <RegisterForm />
      <ImagesComponent images={images}/>
    </div>
  );
};

export default RegisterPage;
