import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Navigation.module.css";

const Navigation = () => {
  const location = useLocation();

  const linkStyle = (path) => ({
    color: location.pathname === path ? "#212121" : "#9B9FAA",
  });

  return (
    <nav>
      <ul className={styles.navLinkContainer}>
        <li className={styles.navLink}>
          <Link to="/login" style={linkStyle("/login")}>
            Log In
          </Link>
        </li>
        <li className={styles.navLink}>
          <Link to="/register" style={linkStyle("/register")}>
            Registration
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
