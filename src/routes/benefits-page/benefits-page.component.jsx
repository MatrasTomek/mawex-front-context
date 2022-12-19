
import { BENEFITS_CONETNT_1, BENEFITS_CONETNT_2 } from "../../content/benefits-content";
import styles from "./benefits-page.module.scss";

const BenefitsPage = () => {



    const content1Items = BENEFITS_CONETNT_1.content.map((item, index) => (
        <li key={ index }>{ item }</li>
    ));

    const content2Items = BENEFITS_CONETNT_1.content.map((item, index) => (
        <li key={ index }>{ item }</li>
    ));

    return (
        <div className={ styles.wrapper }>
            <div className={ styles.banner }>
                <h1>Korzyści</h1>
            </div>
            <div className={ styles.infoConetnt }>
                <div className={ styles.content1 }>
                    <h3>{ BENEFITS_CONETNT_1.title }</h3>
                    <ul>
                        { content1Items }
                    </ul>
                </div>
                <div className={ styles.content2 }>
                    <h3>{ BENEFITS_CONETNT_2.title }</h3>
                    <ul>
                        { content2Items }
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default BenefitsPage;