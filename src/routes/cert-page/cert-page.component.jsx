import styles from "./cert-page.module.scss";

const CertPage = () => {
    return (
        <div className={ styles.wrapper }>
            <div className={ styles.banner }>
                <h1>Certyfikaty</h1>
            </div>
            <div className={ styles.infoConetnt }>
                <h3>Stale podnosimy nasze umiejętności</h3>
                <div className={ styles.certViev }></div>
            </div>
        </div>
    );
};


export default CertPage;