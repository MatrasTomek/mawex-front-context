import { FormReservation } from "../../components";
import { BASIC_CARS } from "../../content/reservation-content";
import styles from "./reservation-page.module.scss";

const ReservationPage = () => {

    const carsViev = BASIC_CARS.map((item) => (
        <div key={ item.id } className={ styles.car }>
            <img src={ `${ item.img }` } alt={ `${ item.name }` } />
            <div className={ styles.carInfo }>
                <h3>{ item.name }</h3>
                <p>Paliwo: { item.fuel }</p>
                <p>Skrzynia: { item.gear }</p>
                <p>Ilośc drzwi: { item.doors }</p>
            </div>
        </div>
    ));

    return (
        <div className={ styles.wrapper }>
            <div className={ styles.banner }>
                <h1>Wypożyczalnia</h1>
            </div>
            <div className={ styles.infoConetnt }>
                <div className={ styles.content1 }>
                    <h3>Tytuł -1</h3>
                    <ul>
                        <li>informacja 1...</li>
                        <li>informacja 2...</li>
                        <li>informacja 3...</li>
                    </ul>
                </div>
                <div className={ styles.content2 }>
                    <h3>Tytuł -2 </h3>
                    <a href="/">link</a>
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Atque corrupti consequuntur officiis sapiente blanditiis esse a dolorem sit suscipit, odit repellat quia amet facere similique nesciunt vitae cum commodi iste?</p>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Amet accusantium, vel dolores dolorum voluptatum eius in, accusamus doloremque minima, molestias recusandae enim neque sequi eveniet vitae quae blanditiis libero labore!
                        Sit, possimus voluptatum! Molestias eos necessitatibus, aliquam quae quidem consequuntur vel iusto nostrum voluptatem, adipisci aspernatur minus nobis eligendi quos. Expedita ea earum provident enim corporis aspernatur consequatur? Suscipit, ullam?</p>
                </div>
            </div>
            <div className={ styles.cars }>
                { carsViev }
            </div>
            <div className={ styles.reservation }>
                <h3>Sprawdź dostępność</h3>
                <FormReservation />
            </div>
        </div>
    );
};

export default ReservationPage;