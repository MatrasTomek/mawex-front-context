import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components";
import { firstSection, offerSection } from "../../content/homepage-content";
import styles from "./home.module.scss";

const Home = () => {

    const { bigTitle, title1, title2, title3, content1, content2, content3 } = firstSection;

    const [isBox1Open, setIsBox1Open] = useState(false);
    const [isBox2Open, setIsBox2Open] = useState(false);
    const [isBox3Open, setIsBox3Open] = useState(false);

    const offerSectionItems = offerSection.map((item) => (
        <div className={ styles.offerItem } key={ item.id }>
            <Link to={ `${ item.linkPath }` }>
                <h4>{ item.title }</h4>
                <p>{ item.content }</p>
            </Link>
        </div>
    ));

    const handleOpenBox = (e) => {
        let boxNumber = e.target.id;

        switch (boxNumber) {
            case "homeBox1":
                setIsBox1Open(!isBox1Open);
                break;
            case "homeBox2":
                setIsBox2Open(!isBox2Open);
                break;
            case "homeBox3":
                setIsBox3Open(!isBox3Open);
                break;
            default: return;
        };

    };

    return (
        <div className={ styles.wrapper }>
            <h1>{ bigTitle }</h1>
            <div className={ styles.infoSection }>
                <Link to="/">
                    <div>
                        <h3>{ title1 }</h3>
                        { isBox1Open ? (<p>{ content1 }</p>) : ("") }
                        <div className={ styles.buttons }>
                            <Button id="homeBox1" name={ `${ isBox1Open ? "zamknij" : "czytaj dalej" }` } type="button" onClick={ handleOpenBox } />
                        </div>
                    </div>
                </Link>
                <Link to="/">

                    <div>
                        <h3>{ title2 }</h3>
                        { isBox2Open ? (<p>{ content2 }</p>) : ("") }
                        <div className={ styles.buttons }>
                            <Button id="homeBox2" name={ `${ isBox2Open ? "zamknij" : "czytaj dalej" }` } type="button" onClick={ handleOpenBox } />
                        </div>
                    </div>
                </Link>
                <Link to="/">

                    <div>

                        <h3>{ title3 }</h3>
                        { isBox3Open ? (<p>{ content3 }</p>) : ("") }
                        <div className={ styles.buttons }>
                            <Button id="homeBox3" name={ `${ isBox3Open ? "zamknij" : "czytaj dalej" }` } type="button" onClick={ handleOpenBox } />
                        </div>
                    </div>
                </Link>
            </div>
            <div className={ styles.offerSection }>
                <h3>Nasza oferta</h3>
                { offerSectionItems }
            </div>
        </div>
    );
};

export default Home;