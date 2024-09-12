import React, { useState } from "react";
import { register } from "../../redux/auth/authOperations.js";
import styles from "./RegisterForm.module.css";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";


const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await dispatch(register(formData)).unwrap();

      navigate("/");
    } catch (error) {
      console.error("Registration failed: ", error);
    }
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1 className={styles.registerTitle}>Register</h1>
      <form className={styles.registerForm} onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <input
            type="text"
            name="name"
            placeholder="Name *"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputContainer}>
          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={formData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.inputContainer}>
          <input
            type="password"
            name="password"
            placeholder="Password *"
            value={formData.password}
            onChange={handleInputChange}
          />
        </div>
        <div className={styles.btnContainer}>
          <div className={styles.registerBtnContainer}>
            <button type="submit" className={styles.registerBtn}>
              Register
            </button>
          </div>
          <div className={styles.registerBtnContainer}>
            <button
              type="button"
              className={styles.loginBtn}
              onClick={handleLoginClick}
            >
              Log in
            </button>
          </div>
        </div>
      </form>

    </div>
  );
};

export default RegisterForm;
