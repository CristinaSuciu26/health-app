import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DiaryProductsList.module.css";
import { removeProduct } from "../../redux/products/productsOperations";
import { selectSelectedDate } from "../../redux/products/productsSelectors";
import close from "../../assets/images/logo/close.svg";

const DiaryProductsList = ({ consumedProducts }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);

  const handleDelete = (id) => {
    dispatch(removeProduct(id));
  };

  const filteredProducts = consumedProducts.filter(
    (product) => product.date.split("T")[0] === selectedDate
  );

  console.log(
    "Filtered products for selectedDate:",
    selectedDate,
    filteredProducts
  );

  return (
    <div>
      <div className={styles.listContent}>
        <ul className={styles.productList}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li key={product._id} className={styles.productItem}>
                <span className={styles.productTitle}>
                  {product.productDetails?.name || "Unknown Product"}
                </span>

                <span className={styles.productGrams}>
                  {product.quantity || "N/A"} g
                </span>

                <span className={styles.productCalories}>
                  {product.productDetails?.calories
                    ? `${Math.round(product.productDetails.calories)} kcal`
                    : "N/A"}
                </span>

                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(product._id)}
                  aria-label={`Remove ${
                    product.productDetails?.name || "product"
                  }`}
                >
                  <img src={close} alt="Close Button" />
                </button>
              </li>
            ))
          ) : (
            <li className={styles.noProductMessage}>
              No products for this date
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DiaryProductsList;
