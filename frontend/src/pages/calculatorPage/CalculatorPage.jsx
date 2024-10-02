import React from "react";
import DailyCaloriesForm from "../../components/caloriesForm/DailyCaloriesForm";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/authSelectors";
import ImagesComponent from "../../components/imagesComponent/imagesComponent";
import styles from "./CalculatorPage.module.css";
import leafs from "../../assets/images/leafs.png";
import leafsDesktop from "../../assets/images/leafs-desktop.png";
import layer from "../../assets/images/layer.png";
import layerDesktop from "../../assets/images/layer-desktop.png";
import banana from "../../assets/images/banana.png";
import bananaDesktop from "../../assets/images/banana-desktop.png";
import strawberry from "../../assets/images/strawberry.png";
import strawberryDesktop from "../../assets/images/strawberry-desktop.png";

const CalculatorPage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const images = [
    {
      src: leafs,
      srcDesktop: leafsDesktop,
      alt: "Leafs",
      className: `${styles.leafs}`,
    },
    {
      src: layer,
      srcDesktop: layerDesktop,
      alt: "Layer",
      className: `${styles.layer}`,
    },
    {
      src: banana,
      srcDesktop: bananaDesktop,
      alt: "Banana",
      className: `${styles.banana}`,
    },
    {
      src: strawberry,
      srcDesktop: strawberryDesktop,
      alt: "Strawberry",
      className: `${styles.strawberry}`,
    },
  ];

  return (
    <div className={styles.calculatorPageContainer}>
      {isLoggedIn ? (
        <DailyCaloriesForm />
      ) : (
        <>
          <DailyCaloriesForm />
          <ImagesComponent images={images} />
        </>
      )}
    </div>
  );
};

export default CalculatorPage;
