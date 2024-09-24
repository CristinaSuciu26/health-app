import React from "react";
import DailyCaloriesForm from "../../components/caloriesForm/DailyCaloriesForm";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/auth/authSelectors";
import ImagesComponent from "../../components/imagesComponent/imagesComponent";
import styles from "./CalculatorPage.module.css"

const CalculatorPage = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <div className={styles.calculatorPageContainer}>
      {isLoggedIn ? (
        <>
          <DailyCaloriesForm />
        </>
      ) : (
        <>
          <DailyCaloriesForm />
          <ImagesComponent />
        </>
      )}
    </div>
  );
};

export default CalculatorPage;
