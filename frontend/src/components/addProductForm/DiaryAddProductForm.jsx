import React, { useEffect, useState } from "react";
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
import closeAddForm from "../../assets/images/logo/closeAddForm.svg";
import addButton from "../../assets/images/logo/addButton.svg";

const DiaryAddProductForm = () => {
  const dispatch = useDispatch();
  const productName = useSelector(selectProductName);
  const grams = useSelector(selectGrams);
  const selectedDate = useSelector(selectSelectedDate);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = "";
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isModalOpen]);

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
    <>
      <div className={styles.largerScreensForm}>
        <form onSubmit={handleSubmit} className={styles.addProductForm}>
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
          <button
            onClick={openModal}
            className={styles.addButton}
            type="submit"
          >
            <img src={addButton} alt="Add button" />
          </button>
        </form>
      </div>
      <div className={styles.mobileForm}>
        <button onClick={openModal} className={styles.addButton}>
          <img src={addButton} alt="Add button" />
        </button>
        {isModalOpen && (
          <>
            <div className={styles.modalOverlay}>
              <button
                className={styles.closeButton}
                onClick={closeModal}
                aria-label="Close"
              >
                <img src={closeAddForm} alt="Close" />
              </button>
              <form onSubmit={handleSubmit} className={styles.addProductForm}>
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
                <button
                  type="submit"
                  className={styles.addProductBtn}
                  onClick={openModal}
                >
                  Add product
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default DiaryAddProductForm;
