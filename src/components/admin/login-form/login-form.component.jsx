import { useState } from "react";
import { Form, Field } from "react-final-form";
import Button from "../../button";
import styles from "./login-form.module.scss";

const required = (value) => (value ? undefined : "Pole wymagane");

const LoginForm = ({ onLogin, notice }) => {
	const [error, setError] = useState(null);

	const onSubmit = async ({ login, password }) => {
		setError(null);
		const res = await onLogin(login, password);
		if (!res.ok) setError(res.message);
	};

	return (
		<div className={styles.wrapper}>
			<h1>Panel Mawex — logowanie</h1>
			{notice && <p className={styles.notice}>{notice}</p>}
			<Form
				onSubmit={onSubmit}
				render={({ handleSubmit, submitting }) => (
					<form onSubmit={handleSubmit} className={styles.form} noValidate>
						<Field name="login" validate={required}>
							{({ input, meta }) => (
								<div className={styles.field}>
									<label htmlFor="admin-login">Login</label>
									<input {...input} id="admin-login" type="email" autoComplete="username" />
									{meta.error && meta.touched && <span className={styles.error}>{meta.error}</span>}
								</div>
							)}
						</Field>
						<Field name="password" validate={required}>
							{({ input, meta }) => (
								<div className={styles.field}>
									<label htmlFor="admin-password">Hasło</label>
									<input {...input} id="admin-password" type="password" autoComplete="current-password" />
									{meta.error && meta.touched && <span className={styles.error}>{meta.error}</span>}
								</div>
							)}
						</Field>
						{error && <p className={styles.error}>{error}</p>}
						<Button type="submit" name={submitting ? "Logowanie…" : "Zaloguj"} />
					</form>
				)}
			/>
		</div>
	);
};

export default LoginForm;
