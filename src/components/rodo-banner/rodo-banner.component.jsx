import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { RodoContext } from "../../contexts/rodo-banner.context";
import { setCookie } from "../../utils/cookie.utils";
import { Button } from "..";
import styles from "./rodo-banner.module.scss";

const RodoBanner = () => {
  const { isRodoAccepted, setIsRodoAccepted } = useContext(RodoContext);

  useEffect(() => {
    if (document.cookie === "accessForMawex") {
      setIsRodoAccepted(true);
    } else {
      setIsRodoAccepted(false);
    }
  }, [setIsRodoAccepted]);

  const handleOnSetCookie = () => {
    setCookie();
    setIsRodoAccepted(true);
  };

  const handleOnCloseRodoBanner = () => {
    setIsRodoAccepted(true);
  };

  return (
    <div
      className={styles.wrapper}
      style={{ display: `${isRodoAccepted ? "none" : "block"}` }}
    >
      <div className={styles.inside}>
        <div className={styles.content}>
          <p>
            Ta strona korzysta z plików cookie "ciasteczek". To pliki tekstowe
            zapisywane w Twojej przeglądarce. To konieczne aby wykorzystać w
            pełni działanie przeglądarki i naszego programu. Dzięki nim mamy
            możliwość np. niewyświetlania tego baneru jeżeli zaakceptujesz Naszą
            plitykę. Brak wyrażenia zgody lub wycofanie zgody niekorzystnie
            wpłynie na niektóre cechy i funkcje tej strony.
          </p>
        </div>
        <div className={styles.buttons}>
          <Button name="Akceptuj" onClick={handleOnSetCookie} />
          <Button name="Odrzuć" onClick={handleOnCloseRodoBanner} />
        </div>
        <div className={styles.links}>
          <Link to="/pliki-cookie">Ciasteczka</Link>
          <a href="/klauzula.jpg" target="blank">
            Polityka Rodo
          </a>
        </div>
      </div>
    </div>
  );
};

export default React.memo(RodoBanner);
