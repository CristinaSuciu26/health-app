import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DiaryProductsList from "../../components/productList/DiaryProductsList";
import DiaryDateCalendar from "../../components/diaryCalendar/DiaryDateCalendar";
import DiaryAddProductForm from "../../components/addProductForm/DiaryAddProductForm";
import { getConsumedProducts } from "../../redux/products/productsOperations";
import { setSelectedDate } from "../../redux/products/productsSlice";
import {
  selectConsumedProducts,
  selectDailyIntake,
  selectProducts,
  selectSelectedDate,
} from "../../redux/products/productsSelectors";
import DailyCalorieIntake from "../../components/calorieIntake/DailyCalorieIntake";
import styles from "./DiaryPage.module.css";
import { formatDate } from "../../utils/dateUtils";

const DiaryPage = () => {
  const dispatch = useDispatch();
  const selectedDate = useSelector(selectSelectedDate);
  const consumedProducts = useSelector(selectConsumedProducts);
  const dailyIntake = useSelector(selectDailyIntake);
  const productsNotRecommended = useSelector(selectProducts);

  const handleDateChange = (date) => {
    const formattedDate = formatDate(date);
    if (formattedDate) {
      dispatch(setSelectedDate(formattedDate));
      dispatch(getConsumedProducts(formattedDate));
    } else {
      console.error("Invalid date:", date);
    }
  };
  const validProducts = consumedProducts.filter(
    (product) => product.id || product._id
  );

  return (
    <div className={styles.diaryPageContainer}>
      <div className={styles.diaryPageContent}>
        <DiaryDateCalendar onDateChange={handleDateChange} />
        <div className={styles.addProductContent}>
          <DiaryProductsList
            consumedProducts={validProducts}
            selectedDate={selectedDate}
          />
          <DiaryAddProductForm selectedDate={selectedDate} />
        </div>
      </div>

      <DailyCalorieIntake
        calories={dailyIntake}
        dietRecommendations={productsNotRecommended}
      />
    </div>
  );
};

export default DiaryPage;
