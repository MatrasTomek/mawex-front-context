import { useContext, Fragment, useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { DropDownMenu } from "../../routes";
import { ReservationContext } from "../../contexts/reservation-view.context";
import { DarkModeContext } from "../../contexts/dark-mode.context";
import { SwitchTheme } from "../../components";
import styles from "./navigation.module.scss";


const Navigation = () => {
  const { isReasrvartionPage, setIsReasrvartionPage } =
    useContext(ReservationContext);

  const { isDarkModeActive } =
    useContext(DarkModeContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOpenCloseMenu = (e) => {
    setIsMenuOpen(!isMenuOpen);
    if (e.target.id === "reservation") {
      setIsReasrvartionPage(true);
    } else {
      setIsReasrvartionPage(false);
    }
  };

  const handleSwitchLogo = () => {
    setIsReasrvartionPage(false);
  };

  return (
    <Fragment>
      <div className={ `${ !isDarkModeActive ? styles.navWrapper : styles.navWrapperDark }` }>
        <Link to="/" className={styles.navLink} onClick={handleSwitchLogo}>
          <div className={styles.navLogo}>
            {!isReasrvartionPage ? (
              <img src="images/logo_maw.png" alt="logo" />
            ) : (
              <img src="images/logo_wyp.png" alt="logo-wypozyczalnia" />
            )}
          </div>
        </Link>
        <div className={styles.navBurger} onClick={handleOpenCloseMenu}>
          {!isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M3 18h13v-2H3v2zm0-5h10v-2H3v2zm0-7v2h13V6H3zm18 9.59L17.42 12 21 8.41 19.59 7l-5 5 5 5L21 15.59z" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 0 24 24"
              width="24px"
              fill="#000000"
            >
              <path d="M0 0h24v24H0z" fill="none" />
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          )}
        </div>
        <div
          className={!isMenuOpen ? styles.navLinksClose : styles.navLinksOpen}
        >
          <Link id="start" to="/" onClick={handleOpenCloseMenu}>
            Home
          </Link>
          <Link id="offer" to="/offer" onClick={handleOpenCloseMenu}>
            Oferta
          </Link>
          {/* <DropDownMenu /> */}
          <Link
            id="certificates"
            to="/certificates"
            onClick={handleOpenCloseMenu}
          >
            Certyfikaty
          </Link>
          <Link id="benefits" to="/benefits" onClick={handleOpenCloseMenu}>
            Korzyści
          </Link>
          <Link id="law" to="/law" onClick={handleOpenCloseMenu}>
            Prawo
          </Link>
          <Link id="blog" to="/blog" onClick={handleOpenCloseMenu}>
            Blog
          </Link>
          <Link id="contact" to="/contact" onClick={handleOpenCloseMenu}>
            Kontakt
          </Link>
          <Link
            id="reservation"
            to="/wypozyczalnia"
            onClick={handleOpenCloseMenu}
          >
            Wypożyczalnia
          </Link>
          <Link id="consultation" to="/offer" onClick={handleOpenCloseMenu}>
            BEZPŁATNA KONSULTACJA
          </Link>
        </div>
        <div className={ styles.switchTheme }><SwitchTheme /></div>
      </div>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
