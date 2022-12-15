

import { SUB_OFFERS } from "../../../content/sub-offers-content";
import styles from "./sub-routes.module.scss";

const SubRoutes = ({ dataPath }) => {

    const content = SUB_OFFERS.find(offer => offer.routePath === dataPath);

    return (
        <h2>{ content.mainTitle }</h2>
    );

};

export default SubRoutes;