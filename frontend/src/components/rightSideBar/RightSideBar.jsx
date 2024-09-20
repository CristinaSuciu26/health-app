import { Link, useLocation } from "react-router-dom";
import menu from "../../assets/images/logo/menu.svg";
import close from "../../assets/images/logo/close.svg";
import { useEffect, useState } from "react";
import styles from "./RightSideBar.module.css";
import logo2 from "../../assets/images/logo/logo2.svg";
import Vector from "../../assets/images/logo/Vector.svg";

const RightSideBar = ({ user, handleLogout }) => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleClickOutside = (e) => {
    if (e.target.classList.contains(styles.modalOverlay)) {
      closeModal();
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 870 && isModalOpen) {
        closeModal();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isModalOpen]);

  const handleLinkClick = () => {
    closeModal();
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
      <div className={styles.menuIconContainer}>
        <button
          className={styles.menuIcon}
          aria-haspopup="true"
          aria-expanded={isModalOpen}
          onClick={openModal}
        >
          <img src={menu} alt="Menu" />
        </button>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={handleClickOutside}>
          <div className={styles.modalHeader}>
            <img className={styles.logoSideBar} src={logo2} alt="Logo" />
            <ul className={styles.infoContainer}>
              <li className={styles.userName}>
                <p>{user?.name}</p>
              </li>
              <img src={Vector} alt="Logo" />
              <li>
                <button className={styles.userExit} onClick={handleLogout}>
                  Exit
                </button>
              </li>
            </ul>
            <button
              className={styles.closeButton}
              onClick={closeModal}
              aria-label="Close"
            >
              <img src={close} alt="Close" />
            </button>
          </div>
          <div className={styles.modalContent}>
            <ul>
              <li>
                <Link
                  to="/diary"
                  style={linkStyle("/diary")}
                  onClick={handleLinkClick}
                >
                  Diary
                </Link>
              </li>
              <li>
                <Link to="/" style={linkStyle("/")} onClick={handleLinkClick}>
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
