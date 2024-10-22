import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/header/Header.jsx";
import "./App.css";
import LoginPage from "./pages/loginPage/LoginPage.jsx";
import RegisterPage from "./pages/registerPage/RegisterPage.jsx";
import Loader from "./components/loader/Loader.jsx";
import useNotifications from "./hooks/useNotifications.js";
import CalculatorPage from "./pages/calculatorPage/CalculatorPage.jsx";
import DiaryPage from "./pages/diaryPage/DiaryPage.jsx";
import PrivateRoute from "./privateRoute.js";

const App = () => {
  useNotifications();

  return (
    <Router>
      <Loader />
      <Header />
      <Routes>
        <Route path="/" element={<CalculatorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/diary"
          element={<PrivateRoute element={<DiaryPage />} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
