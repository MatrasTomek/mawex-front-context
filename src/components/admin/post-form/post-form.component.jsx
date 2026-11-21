import { useEffect, useMemo, useRef, useState } from "react";
import { Form, Field } from "react-final-form";
import AdminModal from "../admin-modal";
import { uploadPhoto, addPost, updatePost } from "../../../utils/admin.utils";
import styles from "./post-form.module.scss";

const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_BYTES = 10 * 1024 * 1024;
const FIELDS = ["title", "content1", "content2", "link", "userName", "date"];

const required = (value) => (value && String(value).trim() ? undefined : "Pole wymagane");

const todayIso = () => {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const TextField = ({ name, label, textarea, type = "text", validate }) => (
	<Field name={name} validate={validate}>
		{({ input, meta }) => (
			<div className={styles.field}>
				<label htmlFor={`post-${name}`}>{label}</label>
				{textarea ? <textarea {...input} id={`post-${name}`} rows={6} /> : <input {...input} id={`post-${name}`} type={type} />}
				{meta.error && meta.touched && <span className={styles.error}>{meta.error}</span>}
			</div>
		)}
	</Field>
);

const PostForm = ({ post, token, defaultUserName, onSaved, onCancel, onUnauthorized }) => {
	const isNew = !post;
	const [file, setFile] = useState(null);
	const [fileError, setFileError] = useState(null);
	// nazwa zdjęcia już wgranego w tym formularzu — ponowny zapis po błędzie nie wgrywa go drugi raz
	const [uploadedName, setUploadedName] = useState(null);
	const [saveError, setSaveError] = useState(null);
	const [expired, setExpired] = useState(false);
	const busy = useRef(false);
	// zmiana klucza montuje pole pliku od nowa — odrzucony plik nie zostaje w nim „wybrany”
	const [fileInputKey, setFileInputKey] = useState(0);

	const initialValues = useMemo(() => {
		if (isNew) return { title: "", content1: "", content2: "", link: "", userName: defaultUserName || "", date: todayIso() };
		return Object.fromEntries(FIELDS.map((key) => [key, post[key] ?? ""]));
	}, [isNew, post, defaultUserName]);

	// URL tworzony w efekcie (nie w useMemo): każdy utworzony jest zwalniany, także w StrictMode
	const [previewUrl, setPreviewUrl] = useState(null);
	useEffect(() => {
		if (!file) {
			setPreviewUrl(null);
			return undefined;
		}
		const url = URL.createObjectURL(file);
		setPreviewUrl(url);
		return () => URL.revokeObjectURL(url);
	}, [file]);

	const handleFile = (event) => {
		const chosen = event.target.files && event.target.files[0];
		setUploadedName(null);
		if (!chosen) return setFile(null);
		const rejected = !ALLOWED.includes(chosen.type) ? "Dozwolone: JPG, PNG, WEBP, GIF" : chosen.size > MAX_BYTES ? "Plik jest za duży (max 10 MB)" : null;
		if (rejected) {
			setFile(null);
			setFileInputKey((k) => k + 1);
			return setFileError(rejected);
		}
		setFileError(null);
		setFile(chosen);
	};

	const missingPhoto = () => isNew && !file && !uploadedName;

	const onSubmit = async (values) => {
		if (busy.current || missingPhoto()) return;
		busy.current = true;
		setSaveError(null);
		try {
			let imgPath = isNew ? null : post.imgPath;
			if (file) {
				let name = uploadedName;
				if (!name) {
					const up = await uploadPhoto(token, file);
					if (up.unauthorized) return setExpired(true);
					if (!up.ok) return setSaveError(up.message);
					name = up.data;
					setUploadedName(name);
				}
				imgPath = `images/blog/${name}`;
			}
			const payload = { ...Object.fromEntries(FIELDS.map((key) => [key, values[key] ?? ""])), imgPath };
			const res = isNew ? await addPost(token, payload) : await updatePost(token, { id: post._id, ...payload });
			if (res.unauthorized) return setExpired(true);
			if (!res.ok) return setSaveError(res.message);
			onSaved(res.data);
		} finally {
			busy.current = false;
		}
	};

	const shownImage = previewUrl || (!isNew && post.imgPath ? `/${post.imgPath}` : null);

	return (
		<AdminModal onClose={expired ? onUnauthorized : onCancel}>
			<Form
				onSubmit={onSubmit}
				initialValues={initialValues}
				render={({ handleSubmit, submitting }) => (
					<form
						className={styles.form}
						noValidate
						onSubmit={(event) => {
							if (missingPhoto()) setFileError("Dodaj zdjęcie");
							return handleSubmit(event);
						}}
					>
						<h2>{isNew ? "Nowy post" : "Edycja posta"}</h2>

						<div className={styles.field}>
							<label htmlFor="post-photo">Zdjęcie</label>
							{shownImage && <img src={shownImage} alt="" className={styles.preview} />}
							<input key={fileInputKey} id="post-photo" type="file" accept={ALLOWED.join(",")} onChange={handleFile} />
							{fileError && <span className={styles.error}>{fileError}</span>}
						</div>

						<TextField name="title" label="Tytuł" validate={required} />
						<TextField name="content1" label="Tekst 1" textarea validate={required} />
						<TextField name="content2" label="Tekst 2" textarea />
						<TextField name="link" label="Link do artykułu" type="url" />
						<div className={styles.row}>
							<TextField name="userName" label="Podpis" validate={required} />
							<TextField name="date" label="Data" type="date" validate={required} />
						</div>

						{expired && (
							<div className={styles.expired}>
								<p>Sesja wygasła — skopiuj treść przed ponownym logowaniem</p>
								<button type="button" onClick={onUnauthorized}>
									Zaloguj ponownie
								</button>
							</div>
						)}
						{saveError && <p className={styles.error}>{saveError}</p>}

						<div className={styles.buttons}>
							{/* po 401 "Anuluj" też wraca do logowania — panel nie może udawać ważnej sesji */}
							<button type="button" onClick={expired ? onUnauthorized : onCancel}>
								Anuluj
							</button>
							<button type="submit" disabled={submitting}>
								{submitting ? "Zapisywanie…" : "Zapisz"}
							</button>
						</div>
					</form>
				)}
			/>
		</AdminModal>
	);
};

export default PostForm;
