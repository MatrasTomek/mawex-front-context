import axios from "axios";

const url = process.env.REACT_APP_URL_TO_BACKEND;

const request = axios.create({
	baseURL: `${url}`,
});

export const sendQuoteMail = async (formData) => {
	const { data, status } = await request.post("mail/price", formData);
	if (status === 200) {
		return data.message;
	} else {
		return "Przepraszamy błąd po stronie serwera - spróbuj jeszce raz za chwilę.";
	}
};

export const sendInfoMail = async (formData) => {
	const { data, status } = await request.post("mail/form", formData);
	if (status === 200) {
		return data.message;
	} else {
		return "Przepraszamy błąd po stronie serwera - spróbuj jeszce raz za chwilę.";
	}
};

export const sendReservationMail = async (formData) => {
	const { data, status } = await request.post("mail/reservation", formData);
	if (status === 200) {
		return data.message;
	} else {
		return "Przepraszamy błąd po stronie serwera - spróbuj jeszce raz za chwilę.";
	}
};
