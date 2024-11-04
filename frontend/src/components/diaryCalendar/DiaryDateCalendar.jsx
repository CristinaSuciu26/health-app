import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { IoCalendarNumberOutline } from "react-icons/io5";
import styles from "./DiaryDateCalendar.module.css";
import { useSelector } from "react-redux";
import { selectSelectedDate } from "../../redux/products/productsSelectors";
import { formatDate } from "../../utils/dateUtils";

const DiaryDateCalendar = ({ onDateChange }) => {
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const selectedDate = useSelector(selectSelectedDate);

  const currentSelectedDate = selectedDate
    ? new Date(selectedDate)
    : new Date();

  const formattedDate = formatDate(currentSelectedDate);

  const toggleCalendar = () => {
    setIsCalendarVisible((prev) => !prev);
  };

  const handleDateChange = (date) => {
    console.log("Selected date:", date);
    if (date instanceof Date && !isNaN(date.getTime())) {
      onDateChange(date);
    } else {
      console.error("Invalid date:", date);
    }
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarContent}>
        <h1 className={styles.currentDate}>{formattedDate}</h1>

        <button onClick={toggleCalendar} className={styles.calendarBtn}>
          <IoCalendarNumberOutline />
        </button>

        {isCalendarVisible && (
          <div className={styles.calendar}>
            <Calendar
              onChange={handleDateChange}
              value={currentSelectedDate}
              maxDate={new Date()}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DiaryDateCalendar;
