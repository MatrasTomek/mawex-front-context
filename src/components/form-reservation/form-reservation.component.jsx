import { useState } from 'react';
import { Form, Field } from 'react-final-form';
import ReactDatePicker, { registerLocale, setdefaultLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { startOfHour, addHours } from "date-fns";
import { Button } from "..";
import { sendReservationMail } from "../../utils/mails.utils";
import { BASIC_CARS } from "../../content/reservation-content";
import styles from "./form-reservation.module.scss";


const required = value => (value ? undefined : 'Wymagane');




const FormReservation = () => {

    const [mailResInfo, setMeilResInfo] = useState(null);

    const presentDay = new Date().toLocaleDateString();


    const onSubmit = async values => {

        const mailRes = await sendReservationMail(values);
        setMeilResInfo(mailRes);

    };

    const carsChooseOptions = BASIC_CARS.map((item) => (
        <option key={ item.id } value={ item.name }>{ item.name }</option>
    ));


    return (
        <div className={ styles.formWrapper }>
            <div className={ styles.form }>
                <Form

                    onSubmit={ onSubmit }
                    render={ ({ handleSubmit, form, submitting, pristine, values }) => (
                        <form
                            onSubmit={ (event) => {
                                const promise = handleSubmit(event);
                                promise &&
                                    promise.then(() => {
                                        form.reset();
                                    });
                                return promise;
                            } }
                        >
                            <div className={ styles.formChoose }>

                                <Field name="car" validate={ required }>
                                    { ({ input, meta }) => (
                                        <div>
                                            <label >Wybierz pojazd</label>
                                            <select { ...input } >
                                                <option />
                                                { carsChooseOptions }
                                            </select>
                                            { meta.error && meta.touched && <span>{ meta.error }</span> }
                                        </div>
                                    ) }

                                </Field>
                                <Field
                                    name="reservationFrom"
                                    validate={ required }
                                >
                                    { ({ input, meta }) => (
                                        <div>
                                            <label>Rezerwacja od</label>
                                            <input type="date" { ...input } min={ `${ presentDay }` } />
                                            { meta.error && meta.touched && <span>{ meta.error }</span> }
                                        </div>
                                    ) }

                                </Field>
                                <Field name="reservationTo" validate={ required }>
                                    { ({ input, meta }) => (
                                        <div>
                                            <label >Rezerwacja do</label>
                                            <input type="date" { ...input } />
                                            { meta.error && meta.touched && <span>{ meta.error }</span> }
                                        </div>
                                    ) }

                                </Field>

                            </div>
                            <div className={ styles.formContact }>

                                <Field
                                    name="name"
                                    validate={ required }
                                >
                                    { ({ input, meta }) => (
                                        <div>
                                            <label>Imię</label>
                                            <input { ...input } type="text" placeholder="imię" />
                                            { meta.error && meta.touched && <span>{ meta.error }</span> }
                                        </div>
                                    ) }

                                </Field>
                                <Field
                                    name="mail"
                                    validate={ required }
                                >
                                    { ({ input, meta }) => (
                                        <div>
                                            <label>adres eMail</label>
                                            <input { ...input } type="email" placeholder="eMail" />
                                            { meta.error && meta.touched && <span>{ meta.error }</span> }
                                        </div>
                                    ) }

                                </Field>
                                <Field
                                    name="phone"
                                    validate={ required }

                                >
                                    { ({ input, meta }) => (
                                        <div>
                                            <label>telefon</label>
                                            <input { ...input } type="tel" placeholder="123456789" pattern="[0-9]{3}[0-9]{3}[0-9]{3}" />
                                            { meta.error && meta.touched && <span>{ meta.error }</span> }
                                        </div>
                                    ) }

                                </Field>
                            </div>
                            <div className={ styles.buttons }>
                                <Button type="submit" name="wyślij" />
                            </div>
                            <div className={ styles.formResponse }>
                                <p>{ mailResInfo }</p>
                            </div>
                        </form>) }
                />
            </div>
        </div >
    );
};
export default FormReservation;