import { Link, useLocation } from "react-router-dom";
import menu from "../../assets/images/logo/menu.svg";
import close from "../../assets/images/logo/close.svg";
import { useState } from "react";
import styles from "./RightSideBar.module.css";

const RightSideBar = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleClickOutside = (e) => {
    if (e.target.classList.contains(styles.modalOverlay)) {
      closeModal();
    }
  };

  const linkStyle = (path) => ({
    color:
      location.pathname === path
        ? isModalOpen
          ? "#fff"
          : "#212121"
        : "#9B9FAA",
    textDecoration: "none",
  });

  return (
    <div>
      <button
        className={styles.menuIcon}
        aria-haspopup="true"
        aria-expanded={isModalOpen}
        onClick={openModal}
      >
        <img src={menu} alt="Menu" />
      </button>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleClickOutside}>
          <div className={styles.modalContent}>
            <button
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Close"
            >
              <img src={close} alt="Close" />
            </button>
            <ul>
              <li>
                <Link to="/diary" style={linkStyle("/diary")}>
                  Diary
                </Link>
              </li>
              <li>
                <Link to="/" style={linkStyle("/")}>
                  Calculator
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className={styles.desktopLinks}>
        <ul>
          <li>
            <Link to="/diary" style={linkStyle("/diary")}>
              Diary
            </Link>
          </li>
          <li>
            <Link to="/" style={linkStyle("/")}>
              Calculator
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RightSideBar;
