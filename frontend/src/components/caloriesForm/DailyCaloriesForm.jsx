import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DailyCaloriesForm.module.css";
import Modal from "../modal/Modal";
import {
  getDailyIntake,
  getProducts,
} from "../../redux/calorieIntake/calorieIntakeOperations";
import {
  selectDailyIntake,
  // selectIsLoading,
  // selectError,
  selectProducts,
} from "../../redux/calorieIntake/calorieIntakeSelectors.js";
import DailyCalorieIntake from "../calorieIntake/DailyCalorieIntake.jsx";
import { selectIsLoggedIn } from "../../redux/auth/authSelectors.js";

const DailyCaloriesForm = () => {
  const dispatch = useDispatch();
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [currentWeight, setCurrentWeight] = useState("");
  const [desiredWeight, setDesiredWeight] = useState("");
  const [bloodType, setBloodType] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const dailyIntake = useSelector(selectDailyIntake);
  const products = useSelector(selectProducts);
  // const isLoading = useSelector(selectIsLoading);
  // const error = useSelector(selectError);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const handleOpenModal = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      await fetchData();
      if (!isLoggedIn) {
        setIsModalVisible(true);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const validateForm = () => {
    if (!height || !age || !currentWeight || !desiredWeight || !bloodType) {
      alert("All fields are required");
      return false;
    }
    if (
      isNaN(parseFloat(height)) ||
      isNaN(parseInt(age)) ||
      isNaN(parseFloat(currentWeight)) ||
      isNaN(parseFloat(desiredWeight)) ||
      isNaN(parseInt(bloodType))
    ) {
      alert("All numeric fields must be valid numbers");
      return false;
    }
    return true;
  };

  const fetchData = async () => {
    const intakeData = {
      height: parseFloat(height),
      age: parseInt(age, 10),
      currentWeight: parseFloat(currentWeight),
      desiredWeight: parseFloat(desiredWeight),
      bloodType: parseInt(bloodType, 10),
    };
    try {
      if (isLoggedIn) {
        await dispatch(getDailyIntake(intakeData)).unwrap();
      } else {
        await dispatch(getProducts(intakeData)).unwrap();
      }
    } catch (err) {
      console.error("Failed to fetch daily intake:", err);
    }
  };

  return (
    <div className={styles.dailyCaloriesContainer}>
      <h2 className={styles.dailyCaloriesTitle}>
        Calculate your daily calorie intake right now
      </h2>
      <form className={styles.dailyCaloriesForm} onSubmit={handleOpenModal}>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="height"
            placeholder="Height (cm) *"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="age"
            placeholder="Age *"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="current-weight"
            placeholder="Current weight (kg) *"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <input
            type="text"
            name="desired-weight"
            placeholder="Desired weight (kg) *"
            value={desiredWeight}
            onChange={(e) => setDesiredWeight(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Blood type *</label>
          <div className={styles.radioGroup}>
            <label className={styles.radioBtnContainer}>
              <input
                type="radio"
                name="blood-type"
                value="1"
                checked={bloodType === "1"}
                onChange={(e) => setBloodType(e.target.value)}
              />
              1
            </label>
            <label className={styles.radioBtnContainer}>
              <input
                type="radio"
                name="blood-type"
                value="2"
                checked={bloodType === "2"}
                onChange={(e) => setBloodType(e.target.value)}
              />
              2
            </label>
            <label className={styles.radioBtnContainer}>
              <input
                type="radio"
                name="blood-type"
                value="3"
                checked={bloodType === "3"}
                onChange={(e) => setBloodType(e.target.value)}
              />
              3
            </label>
            <label className={styles.radioBtnContainer}>
              <input
                type="radio"
                name="blood-type"
                value="4"
                checked={bloodType === "4"}
                onChange={(e) => setBloodType(e.target.value)}
              />
              4
            </label>
          </div>
        </div>
        <div className={styles.btnContainer}>
          <button type="submit" className={styles.losingWeightBtn}>
            Start losing weight
          </button>
        </div>
      </form>

      {isLoggedIn ? (
        <DailyCalorieIntake
          calories={dailyIntake}
          dietRecommendations={products}
        />
      ) : (
        <Modal
          isVisible={isModalVisible}
          onClose={handleCloseModal}
          calories={dailyIntake}
          dietRecommendations={products}
        />
      )}
    </div>
  );
};

export default DailyCaloriesForm;
