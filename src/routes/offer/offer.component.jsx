
import { Link } from 'react-router-dom';
import { FormSwitch } from "../../components";
import { OFFERS_NAMES } from "../../content/offer-content";
import styles from "./offer.module.scss";

const Offer = () => {
    const offerLinksViev = OFFERS_NAMES.map((item) => (
        <Link to={ `/${ item.linkPath }` } key={ item.id }>{ item.name }</Link>
    ));

    return (

        <div className={ styles.wrapper }>
            <div className={styles.title}>
            <h2>Nasza Oferta</h2>
            <a href='/documents/cennik_Mawex_2023.pdf' target='blanck' >Zobacz cennik</a>
            </div>
            <FormSwitch isContactForm={ false } />
            <div className={ styles.info }>
                <h3>Zobacz wszystkie oferty:</h3>
                <ul>
                    { offerLinksViev }
                </ul>
            </div>

        </div>

    );
};

export default Offer;