

import styles from "./elections-page.module.scss";

const ElectionsPage = () => {




    return (
        <div className={ styles.wrapper }>
           <div className={ styles.header }>
                <div className={ styles.title }>
                    <h3>Czyny, a nie słowa!</h3>
                    <h1>MATEUSZ WĘGRZYN</h1>
                    <p>Kandydat do Rady Powiatu w Brzesku</p>
                    <p>Komitet Wyborczy Wyborców Powiat Brzeski</p>
                    <h2>Pozycja nr 4 na liście</h2>
                </div>
                <div className={ styles.picture }></div>
           </div>
            <div className={styles.info}>
                <p>Przedsiębiorca - wspólnik Mawex-Eko Przydomowe Oczyszczalnie oraz Mawex Czas Pracy Kierowców
                Wiceprzewodniczący Rodziny Kolpinga w Jadownikach przy Parafii św. Prokopa Opata
                Były członek Rady Sołeckiej w Jadownikach
                Wiceprzewodniczący Rady Rodziców w Szkole Podstawowej nr 1 w Brzesku
                Członek Rady Rodziców w Międzyszkolnej Regionalnej Orkiestrze Symfonicznej Małopolska
                Członek chórów „Sancti Jacobi” oraz „Gaudium” w Brzesku
                </p>
            </div>
            <div className={styles.message}>
                <p className={styles.title}>Szanowni Mieszkańcy Powiatu Brzeskiego!</p>
                <p>Kandyduję do Rady Powiatu Brzeskiego z niezależnego ugrupowania Komitetu Wyborczego Wyborców Powiat Brzeski.</p>
                <p>Wybory lokalne mają swoją misję. Ważny jest wybór odpowiednich reprezentantów, gdyż tutaj jest realna możliwość wpływu na dokonujące się zmiany w naszym otoczeniu.
                Komitet Wyborczy Wyborców Powiat Brzeski reprezentują sprawdzeni samorządowcy. Są z nami starsi, szanowani obywatele Powiatu Brzeskiego, z których doświadczenia będziemy korzystać. Znajdują się wśród nas młodzi ludzie pełni energii oraz chęci do budowania naszej przyszłości, potrafiący rozwiązywać  problemy w sposób opanowany, merytoryczny i konsekwentny. Nasz zapał, wykształcenie oraz wiele sukcesów w działalności społecznej są niezbędne w tworzeniu lepszej jakości samorządu.
                </p>
                <p>Wiem, że najważniejszy jest człowiek. Głosujmy więc na kandydatów liczących się z innymi ludźmi oraz kierujących się wartościami chrześcijańskimi.</p>
                <p> Obiecuję, iż powierzonego mi zaufania nie zawiodę!</p>
                <div className={styles.signature}></div>
                <p className={styles.footer}>Sfinansowano ze środków Komitet Wyborczy Wyborców Powiat Brzeski</p>
            </div>

            <div className={styles.second}>
                <div className={ styles.title }>
                    <p className={styles.name}>Mateusz Węgrzyn</p>
                    <p>41 lat, żonaty, dwoje dzieci.</p>
                </div>
                <div className={ styles.content }>
                    <div className={ styles.text }>
                        <p>Mieszkam w Jadownikach od urodzenia.</p>
                        <p>Jestem przedsiębiorcą prowadzącym od szesnastu lat firmy Mawex Czas Pracy Kierowców i Mawex-Eko Przydomowe Oczyszczalnie.</p>
                        <p>Od 2012 roku jestem członkiem zarządu Rodziny Kolpinga w Jadownikach – obecnie pełnię funkcję wiceprzewodniczącego.</p>
                        <p>Działałem w Radzie Sołeckiej w Jadownikach.</p>
                        <p>W 2006 roku ukończyłem studia inżynierskie
                            na kierunku Marketing i Zarządzanie w Gospodarce Żywnościowej, a dwa lata później obroniłem tytuł magistra z zakresu Zarządzania w Agrobiznesie
                            na Uniwersytecie Rolniczym im. Hugona Kołłątaja
                            w Krakowie.</p>
                            <p>W 2008 roku ukończyłem studia podyplomowe – Pedagogikę na Uniwersytecie Pedagogicznym
                            w Krakowie. Odbyłem kursy księgowości, instruktora rekreacji ruchowej – hipoterapia oraz instruktora jazdy konnej.</p>
                            <p>
                            W czasie studiów podjąłem pracę w Agencji Restrukturyzacji i Modernizacji Rolnictwa w Brzesku, która pozwoliła mi bliżej poznać potrzeby rolników, a także zdobyć wiedzę na temat pozyskiwania środków finansowych z Unii Europejskiej na rozwój wsi i rolnictwa.
                            </p>
                            <p>Pracowałem w K.S. „Bór” Toporzysko jako hipoterapeuta, prowadząc zajęcia z osobami niepełnosprawnymi ruchowo i umysłowo.</p>
                            <p>Pracę zawodową rozpocząłem w firmie Zasada
                            Trans-Spedition w Brzesku oraz w Zespole Szkół Ponadgimnazjalnych nr 2 w Brzesku jako nauczyciel – wychowawca świetlicy opiekując się młodzieżowym kółkiem teatralnym oraz zespołem muzycznym.</p>
                            <p>Obecnie prowadzę własną działalność gospodarczą.</p>
                            <p>Jako osoba młoda i dynamiczna oraz skuteczna
                            w działaniu, o świeżym, niekonwencjonalnym spojrzeniu na świat, chciałby wykorzystać swoją energię do intensywnego rozwoju i dalszego polepszenia wizerunku Powiatu Brzeskiego.
                            </p>
                            <p >Wierzę, że moje zaangażowanie, doświadczenie
                            i wiedza będą idealnym wkładem w realizację wyzwań podejmowanych przez nasz Powiat.</p>
                            <p className={styles.sentence}>Władza, nawet najmniejsza to nie prawa  i zaszczyty, to przede wszystkim obowiązki oraz służba ludziom</p>
                    </div>
                    <div className={ styles.pictures}>
                        <div className={styles.pic1}></div>
                        <div className={styles.pic2}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ElectionsPage;