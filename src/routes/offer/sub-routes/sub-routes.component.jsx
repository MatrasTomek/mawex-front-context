import { Link } from "react-router-dom";
import { SUB_OFFERS } from "../../../content/sub-offers-content";
import styles from "./sub-routes.module.scss";

const SubRoutes = ({ dataPath }) => {

    const { mainTitle, content1, subTitle1, content2, subTitle2, content3, subTitle3, content4 } = SUB_OFFERS.find(offer => offer.routePath === dataPath);



    return (
        <div className={ styles.wrapper }>
            <div className={ styles.image }>
                <div className={ styles.mainTitle }>
                    <h1>{ mainTitle }</h1>
                </div>
            </div>
            <div className={ styles.content }>
                <div className={ styles.boxOne }>
                    <p>{ content1 }</p>
                </div>
                { content2 === "" ? "" : (
                    <div className={ styles.boxTwo }>
                        <h3>{ subTitle1 }</h3>
                        <p>{ content2 }</p>
                    </div>
                ) }
                { content3 === "" ? "" : (
                    <div className={ styles.boxThree }>
                        <h3>{ subTitle2 }</h3>
                        <p>{ content3 }</p>
                    </div>
                ) }
                { content4 === "" ? "" : (
                    <div className={ styles.boxFour }>
                        <h3>{ subTitle3 }</h3>
                        <p>{ content4 }</p>
                    </div>
                ) }
                <Link to="/offer">Zapytaj o ofertę</Link>
            </div>

        </div>
    );

};

export default SubRoutes;