import { useContext } from "react";
import { LAW_CONETNT } from "../../content/law-content";
import { DarkModeContext } from "../../contexts/dark-mode.context";
import styles from "./law-page.module.scss";

const LawPage = () => {
    const { isDarkModeActive } = useContext(DarkModeContext);
    const contentLinks1 = LAW_CONETNT[0].links.map((item) => (
        <a target="blank" key={ item.id } href={ `${ item.path }` }>{ item.name }</a>
    ));

    const contentLinks2 = LAW_CONETNT[1].links.map((item) => (
        <a target="blank" key={ item.id } href={ `${ item.path }` }>{ item.name }</a>
    ));

    const contentLinks3 = LAW_CONETNT[2].links.map((item) => (
        <a target="blank" key={ item.id } href={ `${ item.path }` }>{ item.name }</a>
    ));

    return (
        <div className={ `${ !isDarkModeActive ? styles.wrapper : styles.wrapperDark }` }>
            <div className={ styles.banner }>
                <h1>Prawo</h1>
            </div>
            <div className={ styles.infoConetnt }>
                <div className={ styles.content1 }>
                    <h3>{ LAW_CONETNT[0].title }</h3>
                    <ul>
                        { contentLinks1 }
                    </ul>
                </div>
                <div className={ styles.content2 }>
                    <h3>{ LAW_CONETNT[1].title }</h3>
                    <ul>
                        { contentLinks2 }
                    </ul>
                </div>
                <div className={ styles.content3 }>
                    <h3>{ LAW_CONETNT[2].title }</h3>
                    <ul>
                        { contentLinks3 }
                    </ul>
                </div>
            </div>
        </div>
    );


};

export default LawPage;