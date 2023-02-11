import { useState } from "react";
import { Modal } from "../../components";
import { CERTYFICATIONS } from "../../content/cert-content";
import styles from "./cert-page.module.scss";

const CertPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleShowBigPhoto = (e) => {
    setIsModalOpen(e.target.id);
    console.log(e.target.id);
  };

  const certificationsView = CERTYFICATIONS.map((item) => (
    <img
      onClick={handleShowBigPhoto}
      src={`${item.path}`}
      alt={`${item.name}`}
      key={`${item.name}`}
      id={`${item.path}`}
    />
  ));

  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        <h1>Certyfikaty</h1>
      </div>
      <div className={styles.infoConetnt}>
        <h3>Stale podnosimy nasze umiejętności</h3>
        <div className={styles.certViev}>{certificationsView}</div>
      </div>
      <Modal isModalOpen={isModalOpen}>
        <div
          className={styles.image}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <span style={{ textAlign: "right" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
              onClick={handleShowBigPhoto}
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </span>

          <img
            src={`${isModalOpen}`}
            alt=""
            style={{ width: "100%", maxHeight: "650px" }}
          />
        </div>
      </Modal>
    </div>
  );
};

export default CertPage;
