import { CONTACT_INFO } from "../../content/contact-content";
import styles from "./footer.module.scss";

const Footer = () => {

    const {
        companyName,
        companyAdress1,
        companyAdress2,
        phone,
        mail,
        facebook,
        gmp } = CONTACT_INFO;

    return (
        <div className={ styles.footerWrapper }>
            <div className={ styles.inside }>
                <div className={ styles.contact }>
                    <p>{ companyName }</p>
                    <p>{ companyAdress1 }</p>
                    <p>{ companyAdress2 }</p>
                    <a href={ `tel:${ phone }` }>Telefon: { phone }</a>
                    <a href={ `mailto:${ mail }` }> { mail }</a>

                </div>
                <div className={ styles.media }>
                    <a href={ `${ gmp }` } target="blank" className={ styles.map }>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000"><path d="M0 0h24v24H0z" fill="none" /><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                    </a>
                    <a href={ `${ facebook }` } target="blank" className={ styles.face }>
                        <img src="/images/Popular-Logo-facebook-icon-png.png" alt="Facebook logo" />
                    </a>
                </div>
            </div>

        </div>
    );
};

export default Footer;