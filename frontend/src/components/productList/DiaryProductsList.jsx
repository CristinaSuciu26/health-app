import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./DiaryProductsList.module.css";
import { removeProduct } from "../../redux/calorieIntake/calorieIntakeOperations";
import { selectSelectedDate } from "../../redux/calorieIntake/calorieIntakeSelectors";

const DiaryProductsList = ({ products }) => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);

  const handleDelete = (id) => {
    dispatch(removeProduct(id));
  };


  const filteredProducts = products.filter(
    (product) => product.date.split("T")[0] === selectedDate
  );

  return (
    <div className={styles.container}>
      <ul className={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <li key={product._id} className={styles.productItem}>
              <span className={styles.productTitle}>
                {product.product?.title || "Unknown Product"}
              </span>

              <span className={styles.productGrams}>
                {product.quantity || "N/A"} grams
              </span>

              <span className={styles.productCalories}>
                {product.product?.calories
                  ? `${Math.round(product.product.calories)} kcal`
                  : "N/A"}
              </span>

              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(product._id)}
                aria-label={`Remove ${product.product?.title || "product"}`}
              >
                X
              </button>
            </li>
          ))
        ) : (
          <li className={styles.noProductMessage}>No products for this date</li>
        )}
      </ul>
    </div>
  );
};

export default DiaryProductsList;
