import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ReservationContext } from "../../contexts/reservation-view.context";

import styles from "./banner-slider.module.scss";

const BannerSlider = () => {
  const BANNER_SLIDER = [
    {
      id: 0,
      content: "Ewidencja czasu pracy kierowców",
      imgPathSmall: "images/banner/digital-print-1198858_640.jpg",
      imgPathBig: "images/banner/digital-print-1198858_1280.jpg",
      urlPath: "ewidencja-czasu-pracy-kierowcy",
    },
    {
      id: 1,
      content: "Prawo, szkolenia, zarządzanie",
      imgPathSmall: "images/banner/regulation-3246979_640.jpg",
      imgPathBig: "images/banner/regulation-3246979_1280.jpg",
      urlPath: "/szkolenia-dla-kierowcow",
    },
    {
      id: 2,
      content: "Wypożyczalnia",
      imgPathSmall: "images/banner/car-1376083_640.jpg",
      imgPathBig: "images/banner/car-1376083_1280.jpg",
      urlPath: "/reservation",
    },
  ];

  const { isReasrvartionPage, setIsReasrvartionPage } =
    useContext(ReservationContext);

  const [picIndex, setPicIndex] = useState(0);

  let indexNo = picIndex;
  const changeIndex = () => {
    indexNo++;
    if (indexNo >= BANNER_SLIDER.length) {
      indexNo = 0;
    }
    setPicIndex(indexNo);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      changeIndex();
    }, 7000);

    return () => {
      clearInterval(interval);
    };
  });

  const handleSwithLogo = (e) => {
    if (e.target.id === "/reservation") {
      setIsReasrvartionPage(true);
    } else {
      setIsReasrvartionPage(false);
    }
  };

  const slider = BANNER_SLIDER.map((item) => (
    <div
      key={item.id}
      className={styles.image}
      style={{ backgroundImage: `url(${item.imgPathBig})`, left: "0%" }}
    >
      <div className={styles.content} style={{}}>
        <p>{item.content} </p>
      </div>
    </div>
  ));

  const slideShow = () => {
    slider[picIndex].props.style.opacity = "1";
    // slider[picIndex === BANNER_SLIDER.length ? 0 : picIndex].props.style.opacity = "0";
    slider[picIndex].props.children.props.style.opacity = "1";
    // slider[picIndex === BANNER_SLIDER.length ? 0 : picIndex].props.children.props.style.opacity = "1";
    slider[picIndex].props.children.props.style.top = "20%";
    // slider[picIndex === BANNER_SLIDER.length ? 0 : picIndex].props.children.props.style.top = "40%";
  };
  slideShow();

  const handleChangeSlide = (e) => {
    setPicIndex(e.target.id);
  };

  const dots = BANNER_SLIDER.map((item) => (
    <div
      key={item.id}
      id={item.id}
      className={styles.dot}
      style={{}}
      onClick={handleChangeSlide}
    ></div>
  ));

  const activeDot = () => {
    dots[picIndex].props.style.backgroundColor = "rgb(180, 180, 180)";
    dots[picIndex].props.style.border = "2px solid rgb(23, 23, 184)";
  };
  activeDot();

  return (
    <div className={styles.wrapper}>
      {slider}
      <div className={styles.links}>
        <Link
          id={BANNER_SLIDER[picIndex].urlPath}
          onClick={handleSwithLogo}
          to={`${BANNER_SLIDER[picIndex].urlPath}`}
        >
          Zobacz
        </Link>
      </div>
      {/* <div className={ styles.dots }>{ dots }</div> */}
    </div>
  );
};

export default BannerSlider;
