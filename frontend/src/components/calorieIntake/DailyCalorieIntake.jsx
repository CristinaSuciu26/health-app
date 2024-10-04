import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getConsumedProducts } from "../../redux/calorieIntake/calorieIntakeOperations";
import {
  selectConsumedProducts,
  selectSelectedDate,
} from "../../redux/calorieIntake/calorieIntakeSelectors";
import styles from "./DailyCalorieIntake.module.css";

const DailyCalorieIntake = ({ calories, dietRecommendations }) => {
  const dispatch = useDispatch();
  const consumedProducts = useSelector(selectConsumedProducts);
  const selectedDate = useSelector(selectSelectedDate);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US").format(date);
  };

  const formattedDate = formatDate(selectedDate);
  useEffect(() => {
    if (formattedDate) {
      dispatch(getConsumedProducts(formattedDate));
    }
  }, [formattedDate, dispatch]);

  const consumedCalories = Array.isArray(consumedProducts)
    ? Math.round(
        consumedProducts.reduce(
          (total, product) => total + (product.product?.calories || 0),
          0
        )
      )
    : 0;

  const caloriesLeft = calories
    ? Math.max(0, calories - consumedCalories)
    : "0";
  const percentageOfNormal = calories
    ? Math.ceil(((consumedCalories / calories) * 100).toFixed(2))
    : "0";

  return (
    <div className={styles.summaryContainer}>
      <div className={styles.summaryContentWrapper}>
        <div className={styles.dayDetails}>
          <h2>Summary for {formatDate(selectedDate)}</h2>
          <ul className={styles.summaryList}>
            <li className={styles.summaryItem}>
              <span className={styles.summaryListName}> Left: </span>

              <span className={styles.percentage}>
                {caloriesLeft ? `${caloriesLeft} kcal` : "0 kcal"}
              </span>
            </li>
            <li className={styles.summaryItem}>
              <span className={styles.summaryListName}> Consumed:</span>

              <span className={styles.percentage}>
                {consumedCalories ? `${consumedCalories} kcal` : "0 kcal"}
              </span>
            </li>
            <li className={styles.summaryItem}>
              <span className={styles.summaryListName}>Daily Rate:</span>

              <span className={styles.percentage}>
                {calories ? `${calories} kcal` : "0 kcal"}
              </span>
            </li>
            <li className={styles.summaryItem}>
              <span className={styles.summaryListName}> n% of normal:</span>

              <span className={styles.percentage}>
                {percentageOfNormal ? ` ${percentageOfNormal}%` : "0 %"}
              </span>
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
