import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DiaryProductsList from "../../components/productList/DiaryProductsList";
import DiaryDateCalendar from "../../components/diaryCalendar/DiaryDateCalendar";
import DiaryAddProductForm from "../../components/addProductForm/DiaryAddProductForm";
import { getConsumedProducts } from "../../redux/calorieIntake/calorieIntakeOperations";
import { setSelectedDate } from "../../redux/calorieIntake/calorieIntakeSlice";
import {
  selectConsumedProducts,
  selectDailyIntake,
  selectProducts,
  selectSelectedDate,
} from "../../redux/calorieIntake/calorieIntakeSelectors";
import DailyCalorieIntake from "../../components/calorieIntake/DailyCalorieIntake";
import styles from "./DiaryPage.module.css";

const DiaryPage = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const products = useSelector(selectConsumedProducts);
  const dailyIntake = useSelector(selectDailyIntake);
  const productsNotRecommended = useSelector(selectProducts);

  useEffect(() => {
    if (selectedDate) {
      dispatch(getConsumedProducts(selectedDate));
    }
  }, [selectedDate, dispatch]);

  const handleDateChange = (date) => {
    if (date instanceof Date && !isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      dispatch(setSelectedDate(formattedDate));
    } else {
      console.error("Invalid date:", date);
    }
  };
  const validProducts = products.filter((product) => product.id || product._id);

  return (
    <div className={styles.diaryPageContainer}>
      <div className={styles.diaryPageContent}>
        <DiaryDateCalendar onDateChange={handleDateChange} />

        <DiaryProductsList
          products={validProducts}
          selectedDate={selectedDate}
        />
        <DiaryAddProductForm selectedDate={selectedDate} />
      </div>

      <DailyCalorieIntake
        calories={dailyIntake}
        dietRecommendations={productsNotRecommended}
      />
    </div>
  );
};

export default DiaryPage;
