import React from "react";
import styles from "./imagesComponent.module.css";

const ImagesComponent = ({ images }) => {
  return (
    <div className={styles.imagesContainer}>
      {images.map((image, index) => (
        <img
          key={index}
          className={styles[image.className] || image.className}
          src={image.src}
          srcSet={`${image.src} 768w, ${image.srcDesktop} 1280w`}
          sizes="(min-width: 1280px) 1280px, (min-width: 768px) 768px, 100vw"
          alt={image.alt}
        />
      ))}
    </div>
  );
};

export default ImagesComponent;
