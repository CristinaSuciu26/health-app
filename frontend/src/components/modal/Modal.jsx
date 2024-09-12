import React from "react";
import styles from "./Modal.module.css";
import { BsArrowLeft } from "react-icons/bs";
import { TfiClose } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const Modal = ({ isVisible, onClose, calories, dietRecommendations }) => {
  const navigate = useNavigate();


  if (!isVisible) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <button className={styles.backButton} onClick={onClose}>
            <BsArrowLeft />
          </button>
          <button className={styles.backButtonDesktop} onClick={onClose}>
            <TfiClose style={{ cursor: "pointer", fontSize: "17px" }} />
          </button>
        </div>
        <h2>Your recommended daily calorie intake is</h2>
        <div className={styles.calorieIntake}>
          {calories !== undefined ? `${calories} kcal` : "N/A"}
        </div>
        <div className={styles.foodsToAvoid}>
          <h3>Foods you should not eat</h3>
          <ol>
            {dietRecommendations ? (
              dietRecommendations.length > 0 ? (
                dietRecommendations.map((item, index) => (
                  <li key={index}>
                    {item.title}
                    {item.calories && ` - ${item.calories} kcal`}
                  </li>
                ))
              ) : (
                <li>No foods to avoid</li>
              )
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "16px",
                }}
              >
                <ClipLoader size={30} color={"#fc842d"} />
              </div>
            )}
          </ol>
        </div>
        <button
          className={styles.losingWeightBtn}
          onClick={() => navigate("/register")}
        >
          Start losing weight
        </button>
      </div>
    </div>
  );
};

export default Modal;
