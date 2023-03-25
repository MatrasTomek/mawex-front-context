import { useState } from "react";
import { FormReservation, ItemViev } from "../../components";
import {
  BASIC_CARS,
  RESERVATION_CONTENT,
} from "../../content/reservation-content";
import styles from "./reservation-page.module.scss";

const ReservationPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pictureName, setPictureName] = useState("");

  const handleShowPicture = (e) => {
    setModalOpen(true);
    setPictureName(e.target.id);
  };

  const carsViev = BASIC_CARS.map((item) => (
    <div key={item.id} className={styles.car}>
      <img src={`${item.img}`} alt={`${item.name}`} id={item.img} />
      <div className={styles.carInfo}>
        <h3>{item.name}</h3>
        <p className={styles.fuel}>
          <span></span> {item.fuel}
        </p>
        <p className={styles.gear}>
          <span></span> {item.gear}
        </p>
        <p className={styles.drive}>
          <span></span> {item.drive}
        </p>
        <p className={styles.hp}>
          <span></span> {item.hp} HP
        </p>
        <p className={styles.price}>
          <span></span> {item.price} zł / doba
        </p>
      </div>
    </div>
  ));

  return (
    <div className={styles.wrapper}>
      <div className={styles.banner}>
        <h1>Wypożyczalnia</h1>
      </div>
      <div className={styles.infoConetnt}>
        <div className={styles.content1}>
          <h3>{RESERVATION_CONTENT[0]}</h3>
          <ul>
            <li>{RESERVATION_CONTENT[1]}</li>
            <li>{RESERVATION_CONTENT[2]}</li>
            <li>{RESERVATION_CONTENT[3]}</li>
          </ul>
        </div>
        <div className={styles.content2}>
          <h3>{RESERVATION_CONTENT[4]}</h3>
          <a
            target="blank"
            href="https://www.google.com/maps/uv?pb=!1s0x47162750dbb2ea7b%3A0x47da26f207243610!3m1!7e115!4s%2Fmaps%2Fplace%2Fmawex%2Bwypo%25C5%25BCyczalnia%2F%4049.9740509%2C20.6287166%2C3a%2C75y%2C156.4h%2C90t%2Fdata%3D*213m4*211e1*213m2*211sqflrNDCgPV5QVBPyifkuOg*212e0*214m2*213m1*211s0x47162750dbb2ea7b%3A0x47da26f207243610%3Fsa%3DX!5smawex%20wypo%C5%BCyczalnia%20-%20Szukaj%20w%20Google!15sCgIgAQ&imagekey=!1e10!2sAF1QipMOmod_gqtngNWUmYJvsUuTp93UxOVsf_KZlyQG&hl=pl&sa=X&ved=2ahUKEwizl6WKyvb9AhXC0qQKHasqDp8Qpx96BAhOEA0"
          >
            google
          </a>
        </div>
      </div>
      <div className={styles.cars}>
        {carsViev}
        <ItemViev
          isModalOpen={modalOpen}
          setModalOpen={setModalOpen}
          pictureName={pictureName}
        />
      </div>
      <div className={styles.reservation}>
        <h3>Sprawdź dostępność</h3>
        <FormReservation />
      </div>
    </div>
  );
};

export default ReservationPage;
