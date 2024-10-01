import React from "react";
import styles from "./imagesComponent.module.css";

const ImagesComponent = ({ images, positions }) => {
  return (
    <div className={styles.imagesContainer}>
      {images.map((image, index) => (
        <img
          key={index}
          className={styles[`image${index}`]}
          src={image.src}
          srcSet={`${image.src} 768w, ${image.srcDesktop} 1280w`}
          sizes="(min-width: 1280px) 1280px, (min-width: 768px) 768px, 100vw"
          alt={image.alt}
          style={positions ? positions[index] : {}}
        />
      ))}
    </div>
  );
};

export default ImagesComponent;
