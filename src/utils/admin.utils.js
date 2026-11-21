import axios from "axios";

// API panelu /mawexadmin. Każda funkcja zwraca Result i nigdy nie rzuca:
// { ok, status, data, message, unauthorized } — status 0 = brak odpowiedzi serwera.
const request = axios.create({
	baseURL: `${process.env.REACT_APP_URL_TO_BACKEND}`,
	validateStatus: () => true,
});

const NETWORK_ERROR = "Brak połączenia z serwerem";

const auth = (token) => ({ Authorization: `Bearer ${token}` });

const INVALID_RESPONSE = "Nieprawidłowa odpowiedź serwera";

// pick zwraca oczekiwaną część odpowiedzi albo undefined, gdy kształt się nie zgadza
// (np. serwer oddał stronę HTML zamiast JSON) — wtedy wynik to błąd, a nie "ok" z pustymi danymi.
const call = async (config, okStatus, pick = () => null) => {
	try {
		const { status, data } = await request.request(config);
		if (status === okStatus) {
			const picked = pick(data && typeof data === "object" ? data : {});
			if (picked !== undefined) return { ok: true, status, data: picked, message: null, unauthorized: false };
			return { ok: false, status, data: null, message: INVALID_RESPONSE, unauthorized: false };
		}
		return {
			ok: false,
			status,
			data: null,
			message: (data && data.message) || `Błąd serwera (${status})`,
			unauthorized: status === 401,
		};
	} catch (error) {
		return { ok: false, status: 0, data: null, message: NETWORK_ERROR, unauthorized: false };
	}
};

const asObject = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : undefined);
const userWithToken = (body) => (asObject(body.user) && typeof body.user.token === "string" ? body.user : undefined);

export const loginRequest = (login, password) =>
	call({ method: "post", url: "users", data: { login, password } }, 200, userWithToken);

export const getMe = (token) => call({ method: "get", url: "users/me", headers: auth(token) }, 200, (body) => asObject(body.user));

// Wylogowanie: unieważnia token w backendzie (DELETE users/me → 200, puste ciało).
export const logoutRequest = (token) => call({ method: "delete", url: "users/me", headers: auth(token) }, 200);

export const getPosts = () => call({ method: "get", url: "posts" }, 200, (body) => (Array.isArray(body.data) ? body.data : undefined));

export const uploadPhoto = (token, file) => {
	const data = new FormData();
	data.append("file", file);
	return call({ method: "post", url: "posts/upload", data, headers: auth(token) }, 201, (body) => (typeof body.fileName === "string" && body.fileName ? body.fileName : undefined));
};

export const addPost = (token, post) =>
	call({ method: "post", url: "posts/add", data: post, headers: auth(token) }, 201, (body) => asObject(body.data));

export const updatePost = (token, post) =>
	call({ method: "put", url: "posts", data: post, headers: auth(token) }, 202, (body) => asObject(body.data));

export const deletePost = (token, id) => call({ method: "delete", url: `posts/${id}`, headers: auth(token) }, 200);
