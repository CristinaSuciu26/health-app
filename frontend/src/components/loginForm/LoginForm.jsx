import React, { useState } from "react";
import styles from "./LoginForm.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../redux/auth/authOperations";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(login(formData)).unwrap();
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div>
      <h1 className={styles.loginTitle}>Log in</h1>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.inputContainer}>
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className={styles.btnContainer}>
          <div className={styles.loginBtnContainer}>
            <button type="submit" className={styles.loginBtn}>
              Log in
            </button>
          </div>
          <div className={styles.loginBtnContainer}>
            <button
              type="button"
              className={styles.registerBtn}
              onClick={handleRegisterClick}
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
