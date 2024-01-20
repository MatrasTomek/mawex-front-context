import { useContext, useState } from "react";
import { FormReservation, ItemViev } from "../../components";
import {
  BASIC_CARS,
  RESERVATION_CONTENT,
} from "../../content/reservation-content";
import { DarkModeContext } from "../../contexts/dark-mode.context";
import styles from "./reservation-page.module.scss";

const ReservationPage = () => {
  const { isDarkModeActive } = useContext(DarkModeContext);

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
        <h3>{item.name} | {item.year}</h3>
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
    <div className={ `${ !isDarkModeActive ? styles.wrapper : styles.wrapperDark }` }>
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
            className={styles.aButton}
            target="blank"
            href="https://www.google.com/search?q=mawex+wypo%C5%BCyczalnia&hl=pl&sxsrf=APwXEdfC2UkzwqCRjyDSZw1aNzOi4VnQqw%3A1681557011852&source=hp&ei=E4Y6ZLSWL4OZlQea9L7ADw&iflsig=AOEireoAAAAAZDqUIwrdYrZI9ahHHChotV7ZBTULf6Ow&gs_ssp=eJzj4tVP1zc0zKoytywsySozYLRSNagwMTc0MzI3NUhJSjJKTTRPsgIJpSQamaUZGZgbmRibGRp4ieQmlqdWKJRXFuQf3VOZXJWYk5eZCABGvBfd&oq=&gs_lcp=Cgdnd3Mtd2l6EAEYADINCC4QxwEQrwEQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJ1AAWABgsA5oAXAAeACAAQCIAQCSAQCYAQCwAQo&sclient=gws-wiz"
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
