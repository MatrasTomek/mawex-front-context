import axios from "axios";

const url = process.env.REACT_APP_URL_TO_BACKEND;

const request = axios.create({
	baseURL: `${url}`,
	// statusy błędów obsługujemy sami (gałąź else z komunikatem dla użytkownika)
	validateStatus: () => true,
});

export const getAllPosts = async () => {
	const { data, status } = await request.get("posts");
	if (status === 200) {
		return data;
	} else {
		return {
			status: status,
			message: "Przepraszamy błąd po stronie serwera, posty nie mogą być na razie załadowane.",
		};
	}
};
