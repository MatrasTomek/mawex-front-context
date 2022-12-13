import { Form, Field } from 'react-final-form';
import { Button } from "../../components";
import { OFFERS_NAMES } from "../../content/offer-content";
import { sendQuoteMail, sendInfoMail } from "../../utils/mails.utils";
import styles from "./form-switch.module.scss";

const FormSwitch = ({ isContactForm }) => {

    const onSubmit = async values => {
        if (isContactForm) {
            await sendInfoMail(values);

        } else {
            await sendQuoteMail(values);
        }
    };

    const fieldsViev = isContactForm ? "" : OFFERS_NAMES.map((item) => (
        <label key={ item.id }>
            <Field name="formOffer"
                component="input"
                type="checkbox"
                value={ item.name } />
            { item.name }
        </label>
    ));

    return (
        <div className={ styles.formWrapper }>
            <div className={ styles.form }>
                <h4>{ isContactForm ? "Skontaktuj się z nami" : "Chcę otrzymać informację na temat:" }</h4>
                <Form
                    onSubmit={ onSubmit }
                    render={ ({ handleSubmit, form, submitting, pristine, values }) => (
                        <form onSubmit={ handleSubmit }>
                            <div className={ styles.formOffer }>
                                { fieldsViev }
                            </div>
                            <div className={ styles.formContact }>
                                <div>
                                    <label>Imię</label>
                                    <Field
                                        name="name"
                                        component="input"
                                        type="text"
                                        placeholder="Imię"
                                    />
                                </div>
                                <div>
                                    <label>Adres eMail</label>
                                    <Field
                                        name="mail"
                                        component="input"
                                        type="email"
                                        placeholder="adres eMail"
                                    />
                                </div>
                                <div>
                                    <label>Telefon</label>
                                    <Field
                                        name="phone"
                                        component="input"
                                        type="number"
                                        placeholder="telefon"
                                    />
                                </div>
                                { isContactForm ? (
                                    <div>
                                        <label>Twoja informacja</label>
                                        <Field
                                            name="content"
                                            component="textarea"
                                            type="text"
                                            placeholder="wpisz tekst"
                                        />
                                    </div>
                                ) : "" }
                            </div>
                            <div className={ styles.buttons }>
                                <Button type="submit" name="wyślij" />
                            </div>
                        </form>) }
                />
            </div>
        </div>
    );
};
export default FormSwitch;