import React from "react";
import styles from "./CalculatorPage.module.css";
import leafs from "../../assets/images/leafs.png";
import leafsDesktop from "../../assets/images/leafs-desktop.png";
import layer from "../../assets/images/layer.png";
import layerDesktop from "../../assets/images/layer-desktop.png";
import banana from "../../assets/images/banana.png";
import bananaDesktop from "../../assets/images/banana-desktop.png";
import strawberry from "../../assets/images/strawberry.png";
import strawberryDesktop from "../../assets/images/strawberry-desktop.png";
import DailyCaloriesForm from "../../components/caloriesForm/DailyCaloriesForm";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/authSelectors";

const CalculatorPage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <div>
      {isLoggedIn ? (
        <>
          <DailyCaloriesForm />
        </>
      ) : (
        <>
          <DailyCaloriesForm />
          <div className={styles.imagesContainer}>
            <img className={styles.leafsImg} src={leafs} alt="leafs" />
            <img
              className={styles.leafsDesktopImg}
              src={leafsDesktop}
              alt="leafs"
            />
            <img className={styles.layerImg} src={layer} alt="layer" />
            <img
              className={styles.layerDesktopImg}
              src={layerDesktop}
              alt="layer"
            />
            <img className={styles.bananaImg} src={banana} alt="banana" />
            <img
              className={styles.bananaDesktopImg}
              src={bananaDesktop}
              alt="banana"
            />
            <img
              className={styles.strawberryImg}
              src={strawberry}
              alt="strawberry"
            />
            <img
              className={styles.strawberryDesktopImg}
              src={strawberryDesktop}
              alt="strawberry"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CalculatorPage;
