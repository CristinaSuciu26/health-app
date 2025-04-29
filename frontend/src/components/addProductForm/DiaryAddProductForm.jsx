import styles from "./DiaryAddProductForm.module.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addProduct,
  searchProducts,
} from "../../redux/products/productsOperations";
import {
  clearProductForm,
  setGrams,
  setProductName,
} from "../../redux/products/productsSlice";
import {
  selectGrams,
  selectProductName,
} from "../../redux/products/productsSelectors";
import closeAddForm from "../../assets/images/logo/closeAddForm.svg";
import addButton from "../../assets/images/logo/addButton.svg";
import AsyncSelect from "react-select/async";

const DiaryAddProductForm = () => {
  const dispatch = useDispatch();
  const productName = useSelector(selectProductName);
  const grams = useSelector(selectGrams);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

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
      productName,
      quantity: parseInt(grams, 10),
    };

    try {
      await dispatch(addProduct(productData)).unwrap();
      dispatch(clearProductForm());
      setSelectedOption(null);
      closeModal();
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  const loadOptions = async (inputValue) => {
    if (!inputValue) return [];

    try {
      const products = await dispatch(searchProducts(inputValue)).unwrap();

      return products.map((product) => ({
        value: product.title,
        label: product.title,
      }));
    } catch (error) {
      console.error("Failed to load options:", error);
      return [];
    }
  };

  const handleSelectChange = (option) => {
    if (option) {
      dispatch(setProductName(option.value));
      setSelectedOption(option);
    }
  };

  return (
    <>
      <div className={styles.largerScreensForm}>
        <form onSubmit={handleSubmit} className={styles.addProductForm}>
          <AsyncSelect
            cacheOptions
            loadOptions={loadOptions}
            onChange={handleSelectChange}
            value={selectedOption}
            defaultOptions
            placeholder="Type..."
            className={styles.selectInput}
          />
          <input
            type="number"
            value={grams}
            placeholder="Grams"
            onChange={handleGramsChange}
            min="1"
          />
          <button className={styles.addButton} type="submit">
            <img src={addButton} alt="Add button" />
          </button>
        </form>
      </div>

      <div className={styles.mobileForm}>
        <button onClick={openModal} className={styles.addButton}>
          <img src={addButton} alt="Add button" />
        </button>
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <button
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Close"
            >
              <img src={closeAddForm} alt="Close" />
            </button>
            <form onSubmit={handleSubmit} className={styles.addProductForm}>
              <AsyncSelect
                cacheOptions
                loadOptions={loadOptions}
                onChange={handleSelectChange}
                value={selectedOption}
                defaultOptions
                placeholder="Type..."
                className={styles.selectInput}
              />
              <input
                type="number"
                value={grams}
                placeholder="Grams"
                onChange={handleGramsChange}
                min="1"
              />
              <button type="submit" className={styles.addProductBtn}>
                Add product
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default DiaryAddProductForm;
