import { Link } from "react-router-dom";
import { OFFERS_NAMES } from "../../content/offer-content";
import styles from "./drop-down-menu.module.scss";

const DropDownMenu = () => {

    const offersItems = OFFERS_NAMES.map((item) => <Link to={ `/${ item.linkPath }` } key={ item.id }>{ item.name }</Link>);


    return (
        <div className={ styles.wrapperDrop }>
            <div className={ styles.inside }>
                <Link to="/offer">Oferta</Link>
                { offersItems }
            </div>
        </div>
    );

};

export default DropDownMenu;