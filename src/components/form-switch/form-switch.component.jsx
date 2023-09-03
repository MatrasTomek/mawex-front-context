import { useContext, useState } from "react";
import { Form, Field } from "react-final-form";
import { Button } from "../../components";
import { OFFERS_NAMES } from "../../content/offer-content";
import { sendQuoteMail, sendInfoMail } from "../../utils/mails.utils";
import { DarkModeContext } from "../../contexts/dark-mode.context";
import styles from "./form-switch.module.scss";

const required = (value) => (value ? undefined : "Wymagane");


const FormSwitch = ({ isContactForm }) => {
  const { isDarkModeActive } = useContext(DarkModeContext);

  const [mailResInfo, setMeilResInfo] = useState(null);

  const onSubmit = async (values) => {
    if (isContactForm) {
      const mailRes = await sendInfoMail(values);
      setMeilResInfo(mailRes);
    } else {
      const mailRes = await sendQuoteMail(values);
      setMeilResInfo(mailRes);
    }
  };

  const fieldsViev = isContactForm
    ? ""
    : OFFERS_NAMES.map((item) => (
        <label key={item.id}>
          <Field
            name="formOffer"
            component="input"
            type="checkbox"
            value={item.name}
          />
          {item.name}
        </label>
      ));

  return (
    <div className={ `${ !isDarkModeActive ? styles.formWrapper : styles.formWrapperDark }` }>
      <div className={styles.form}>
        <h4>
          {isContactForm
            ? "Skontaktuj się z nami"
            : "Chcę otrzymać informację na temat:"}
        </h4>
        <Form
          onSubmit={onSubmit}
          render={({ handleSubmit, form, submitting, pristine, values }) => (
            <form
              onSubmit={(event) => {
                const promise = handleSubmit(event);
                promise &&
                  promise.then(() => {
                    form.reset();
                  });
                return promise;
              }}
            >
              <div className={styles.formOffer}>{fieldsViev}</div>
              <div className={styles.formContact}>
                <Field name="name" validate={required}>
                  {({ input, meta }) => (
                    <div>
                      <label>Imię</label>
                      <input {...input} type="text" placeholder="imię" />
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
                <Field name="mail" validate={required}>
                  {({ input, meta }) => (
                    <div>
                      <label>adres eMail</label>
                      <input {...input} type="email" placeholder="eMail" />
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
                <Field name="phone" validate={required}>
                  {({ input, meta }) => (
                    <div>
                      <label>telefon</label>
                      <input
                        {...input}
                        type="tel"
                        placeholder="123456789"
                        pattern="[0-9]{3}[0-9]{3}[0-9]{3}"
                      />
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>

                {isContactForm ? (
                  <div>
                    <label>Twoja informacja</label>
                    <Field
                      name="content"
                      component="textarea"
                      type="text"
                      placeholder="wpisz tekst..."
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className={styles.formRodo}>
                <Field name="agreed" validate={required}>
                  {({ input, meta }) => (
                    <div className={styles.agreed}>
                      <label>
                        <input {...input} type="checkbox" />
                        Zapoznałem się z polityką{" "}
                        <a className={styles.rodo} href="/">
                          RODO
                        </a>{" "}
                        i wyrażam zgodę na przetwarzanie danych
                      </label>
                      {meta.error && meta.touched && <span>{meta.error}</span>}
                    </div>
                  )}
                </Field>
              </div>
              <div className={styles.buttons}>
                <Button type="submit" name="wyślij" />
              </div>
              <div className={styles.formResponse}>
                <p>{mailResInfo}</p>
              </div>
            </form>
          )}
        />
      </div>
    </div>
  );
};
export default FormSwitch;
