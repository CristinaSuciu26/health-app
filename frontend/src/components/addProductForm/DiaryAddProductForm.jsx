import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DiaryAddProductForm.module.css";
import { addProduct } from "../../redux/calorieIntake/calorieIntakeOperations";
import {
  clearProductForm,
  setGrams,
  setProductName,
} from "../../redux/calorieIntake/calorieIntakeSlice";
import {
  selectGrams,
  selectProductName,
  selectSelectedDate,
} from "../../redux/calorieIntake/calorieIntakeSelectors";

const DiaryAddProductForm = () => {
  const dispatch = useDispatch();
  const productName = useSelector(selectProductName);
  const grams = useSelector(selectGrams);
  const selectedDate = useSelector(selectSelectedDate);

  const handleProductNameChange = (e) => {
    dispatch(setProductName(e.target.value));
  };

  const handleGramsChange = (e) => {
    dispatch(setGrams(e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !grams || isNaN(grams) || parseInt(grams, 10) <= 0) {
      alert("Please enter a valid product name and grams.");
      return;
    }

    const productData = {
      productName: productName,
      date: selectedDate,
      quantity: parseInt(grams, 10),
    };

    try {
      await dispatch(addProduct(productData)).unwrap();
      dispatch(clearProductForm());
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={productName}
          placeholder="Enter product name"
          onChange={handleProductNameChange}
        />
        <input
          type="number"
          value={grams}
          placeholder="Grams"
          onChange={handleGramsChange}
          min="1"
        />
        <button type="submit">Add product</button>
      </form>
    </div>
  );
};

export default DiaryAddProductForm;
