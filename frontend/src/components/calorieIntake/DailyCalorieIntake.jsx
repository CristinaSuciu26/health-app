import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConsumedProducts } from "../../redux/products/productsOperations";
import {
  selectConsumedProducts,
  selectSelectedDate,
} from "../../redux/products/productsSelectors";
import styles from "./DailyCalorieIntake.module.css";

const DailyCalorieIntake = ({ calories, dietRecommendations }) => {
  const dispatch = useDispatch();
  const consumedProducts = useSelector(selectConsumedProducts);
  const selectedDate = useSelector(selectSelectedDate);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US").format(date);
  };

  const formattedDate = useMemo(() => formatDate(selectedDate), [selectedDate]);

  // Refetch products whenever selectedDate changes or a product is added
  useEffect(() => {
    if (selectedDate) {
      dispatch(getConsumedProducts(formattedDate));
    }
  }, [formattedDate, dispatch, consumedProducts.length, selectedDate]);

  // Calculate total consumed calories
  const consumedCalories = useMemo(() => {
    return Array.isArray(consumedProducts)
      ? Math.round(
          consumedProducts.reduce(
            (total, product) => total + (product.productDetails?.calories || 0),
            0
          )
        )
      : 0;
  }, [consumedProducts]);

  const caloriesLeft = calories ? Math.max(0, calories - consumedCalories) : 0;
  const percentageOfNormal = calories
    ? Math.ceil((consumedCalories / calories) * 100)
    : 0;

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryContentWrapper}>
        <div className={styles.dayDetails}>
          <h2>Summary for {formattedDate}</h2>
          <ul className={styles.summaryList}>
            <li className={styles.summaryItem}>
              <span className={styles.summaryListName}>Left:</span>
              <span className={styles.percentage}>{caloriesLeft} kcal</span>
            </li>
            <li className={styles.summaryItem}>
              <span className={styles.summaryListName}>Consumed:</span>

              <span className={styles.percentage}>
                {" "}
                {consumedCalories} kcal
              </span>
            </li>
            <li className={styles.summaryItem}>
              <span className={styles.summaryListName}>Daily Rate:</span>
              <span className={styles.percentage}>{calories || 0} kcal</span>
            </li>
            <li className={styles.summaryItem}>
              <span className={styles.summaryListName}>% of Normal:</span>
              {percentageOfNormal > 100 ? (
                <span
                  className={styles.overconsumption + " " + styles.percentage}
                >
                  {percentageOfNormal} %
                </span>
              ) : (
                <span className={styles.percentage}>
                  {percentageOfNormal} %
                </span>
              )}
            </li>
          </ul>
        </div>
        <div className={styles.foodsToAvoid}>
          <h2>Food Not Recommended</h2>
          <ul className={styles.foodsList}>
            {dietRecommendations && dietRecommendations.length > 0 ? (
              dietRecommendations.map((item, index) => (
                <li key={item._id || index}>{item.title}</li>
              ))
            ) : (
              <li className={styles.noFoods}>
                Your diet will be displayed here
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DailyCalorieIntake;
