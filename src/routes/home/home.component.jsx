import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Z NAMI JESTEŚ NA DOBREJ DRODZE!</h1>
            <div>
                <Link to="/">
                    <div>
                        <h3>Ewidencja czasu pracy kierowców – MAWEX</h3>
                        <p>Firma MAWEX oferuje kompleksowe usługi w zakresie prowadzenia <span>ewidencji czasu pracy kierowców.</span> Zapewniamy wsparcie przedsiębiorcom, przejmując obowiązek wykonywania szczegółowej <span>analizy czasu pracy kierowcy,</span> rozliczania czasu pracy kierowcy, oceny ryzyka wystąpienia naruszeń oraz sprawdzania ciągłości zapisów aktywności kierowców. Korzyścią z podjęcia współpracy jest przede wszystkim rzetelnie przygotowana ewidencja czasu pracy kierowcy, dokładnie wyliczone delegacje krajowe i zagraniczne, nadzorowanie terminowego pobierania danych z tachografów cyfrowych i kart kierowców oraz weryfikację ciągłości zapisów aktywności kierowców co przekłada się dla przedsiębiorcy na oszczędność czasu oraz kosztów. Dodatkowo zapewniamy naszym klientom wstępny audyt dokumentacji, okresowe szkolenia kierowców a także pomoc w zarządzaniu środkami transportu. </p>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Home;