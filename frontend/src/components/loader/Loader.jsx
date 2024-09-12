import React from "react";
import { useSelector } from "react-redux";
import ClipLoader from "react-spinners/ClipLoader";
import styles from "./Loader.module.css";
import { selectIsLoading } from "../../redux/auth/authSelectors"; 

const Loader = () => {
  const loading = useSelector(selectIsLoading);

  return (
    loading && (
      <div className={styles.loader}>
        <ClipLoader size={60} color={"#fc842d"} loading={loading} />
      </div>
    )
  );
};

export default Loader;
