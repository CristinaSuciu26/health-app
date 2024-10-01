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
    { src: leafs, srcDesktop: leafsDesktop, alt: "Leafs" },
    { src: layer, srcDesktop: layerDesktop, alt: "Layer" },
    { src: banana, srcDesktop: bananaDesktop, alt: "Banana" },
    { src: strawberry, srcDesktop: strawberryDesktop, alt: "Strawberry" },
  ];
  // This is optional
  // const positions = [
  //   { top: "-90px", right: "80px", position: "absolute", zIndex: "2" },
  //   { top: "0px", right: "0px", position: "absolute" },
  //   { top: "-24px", right: "0px", position: "absolute" },
  //   { top: "218px", right: "-26px", position: "absolute" },
  // ];

  return (
    <div className={styles.calculatorPageContainer}>
      {isLoggedIn ? (
        <>
          <DailyCaloriesForm />
        </>
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
