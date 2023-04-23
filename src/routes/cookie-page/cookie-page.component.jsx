import React from "react";
import styles from "./cookies-page.module.scss";

const CookiePage = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.inside}>
        <h1> Polityka dotycząca cookies </h1>
        <p>
          W celu świadczenia usług na najwyższym poziomie stosujemy{" "}
          <span>pliki cookies</span>. Korzystanie z naszej witryny oznacza, że
          będą one zamieszczane w Państwa urządzeniu. W każdym momencie można
          dokonać zmiany ustawień Państwa przeglądarki.
        </p>
        <p>
          Dla Państwa wygody <span>serwis przedszkolemokrzyska.pl</span> używa
          plików cookies po to, by{" "}
          <span>dostosować serwis do potrzeb użytkowników</span>, a także w
          celach statystycznych.
        </p>
        <p>
          Pliki cookies (tzw. ciasteczka){" "}
          <span>
            to niewielkie pliki tekstowe wysyłane przez odwiedzany serwis
            internetowy
          </span>{" "}
          do urządzenia internauty (komputer, smartfon itp.). Nie zawierają one
          żadnych danych osobowych.
        </p>
        <p>Serwis przedszkolemokrzyska.pl stosuje dwa typy plików cookies: </p>
        <ul>
          <li>
            wydajnościowe (zbierające informacje na temat sposobu używania
            witryny przez odwiedzających, np. najczęściej odwiedzanych stron lub
            komunikatów o błędach itp.),
          </li>
          <li>
            funkcjonalne (zapisujące ustawienia użytkownika, np. język, wyrażone
            zgody itp.), takie jak:
          </li>
          <ul>
            <li>
              cookies google-analytics.com – służą do prowadzenia statystyk dla
              witryny gov.pl; dokładny sposób działania i politykę prywatności
              Google Analytics można znaleźć pod adresem:
              <a
                href="http://www.google.com/analytics/learn/privacy.html"
                target="blanc"
              >
                google.analitics
              </a>
            </li>
            <li>
              cookies inspectlet.com – służą do określenia sposobu używania
              strony przez użytkowników; dokładny sposób działania i politykę
              prywatności można znaleźć pod adresem:
              <a href="https://www.inspectlet.com/legal" target="blanc">
                inspectlet
              </a>
            </li>
            <li>
              cookies sesyjne – są to tymczasowe informacje przechowywane w
              pamięci przeglądarki do momentu zakończenia sesji, czyli jej
              zamknięcia.
            </li>
          </ul>
        </ul>
        <p>
          <span>
            W większości przeglądarek internetowych można: kasować pliki typu
            cookies z twardego dysku komputera (z poziomu ustawień
            przeglądarki), zablokować wszystkie przysyłane pliki typu cookies
            lub ustawić ostrzeżenie przed zapisaniem ich na dysku.{" "}
          </span>
        </p>
        <p>
          Należy mieć na uwadze, że zmiany ustawień tych plików polegające na
          ograniczeniu ich stosowania mogą wpłynąć na niektóre funkcjonalności
          dostępne na stronach internetowych je stosujących np. uniemożliwiając
          zalogowanie się na konto pocztowe.{" "}
          <span>
            Brak zmiany tych ustawień oznacza akceptację dla stosowania plików
            typu cookies.
          </span>
        </p>
        <p>
          <span>
            Poniżej wskazujemy sposób zmiany ustawień cookies w najbardziej
            popularnych wyszukiwarkach:
          </span>
        </p>
        <ul>
          <li>
            <span>Google Chrome: </span> Menu / Ustawienia / Pokaż ustawienia
            zaawansowane / Prywatność / Ustawienia treści / Pliki cookies –
            należy wybrać odpowiednią opcję.
          </li>
          <li>
            <span>Internet Explorer: </span> Menu / Narzędzia / Opcje
            internetowe / Prywatność – należy wybrać odpowiednią opcję.
          </li>
          <li>
            <span>Mozilla Firefox: </span> Menu / Opcje / Prywatność / Historia
            – należy wybrać odpowiednią opcję.
          </li>
          <li>
            <span>Opera: </span> Menu / Preferencje / Zaawansowane / Ciasteczka
            – należy wybrać odpowiednią opcję.
          </li>
          <li>
            <span>Safari: </span> Menu / Preferencje / Prywatność / Pliki
            cookies – należy wybrać odpowiednią opcję.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default React.memo(CookiePage);
