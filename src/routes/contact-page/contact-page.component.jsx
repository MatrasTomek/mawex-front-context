import { FormSwitch, Maps } from "../../components";
import { CONTACT_INFO } from "../../content/contact-content";
import styles from "./contact-page.module.scss";

const ContactPage = () => {

    const {
        companyName,
        companyAdress1,
        companyAdress2,
        phone,
        mail,
        nip,
        regon,
        krs,
        account } = CONTACT_INFO;

    return (
        <div className={ styles.wrapper }>
            <div className={ styles.banner }>
                <h1>Kontakt</h1>
            </div>
            <div className={ styles.infoConetnt }>
                <div className={ styles.content1 }>
                    <h3>Nasze dane</h3>
                    <p><span>{ companyName }</span></p>
                    <p><span>{ companyAdress1 }</span></p>
                    <p><span>{ companyAdress2 }</span></p>
                    <a href={ `tel:${ phone }` }>Telefon: { phone }</a>
                    <a href={ `mailto:${ mail }` }>eMail: { mail }</a>
                    <p>Nip: { nip }</p>
                    <p>Regon: { regon }</p>
                    <p>KRS: { krs }</p>
                    <p>Nr konta: { account }</p>

                </div>
                <div className={ styles.contactForm }>
                    <FormSwitch isContactForm="true" />
                </div>
                <div className={ styles.maps }>
                    <Maps />
                </div>
            </div>
        </div>
    );
};

export default ContactPage;