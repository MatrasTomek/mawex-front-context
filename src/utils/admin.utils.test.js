import { loginRequest, getMe, logoutRequest, getPosts, uploadPhoto, addPost, updatePost, deletePost } from "./admin.utils";

jest.mock("axios", () => {
	const instance = { request: jest.fn() };
	return { __esModule: true, default: { create: () => instance }, __instance: instance };
});

const { __instance: http } = jest.requireMock("axios");

const respond = (status, data) => http.request.mockResolvedValueOnce({ status, data });

beforeEach(() => http.request.mockReset());

test("login ok returns user", async () => {
	respond(200, { status: 200, user: { token: "t", name: "Ania" } });
	const r = await loginRequest("a@b.pl", "x");
	expect(r).toMatchObject({ ok: true, status: 200, data: { token: "t", name: "Ania" }, unauthorized: false });
	expect(http.request.mock.calls[0][0]).toMatchObject({ method: "post", url: "users", data: { login: "a@b.pl", password: "x" } });
});

test("login 404 passes backend message", async () => {
	respond(404, { message: "Login lub hasło się nie zgadza" });
	const r = await loginRequest("a@b.pl", "zle");
	expect(r).toMatchObject({ ok: false, status: 404, message: "Login lub hasło się nie zgadza" });
});

test("getMe sends bearer token", async () => {
	respond(200, { user: { name: "Ania" } });
	const r = await getMe("abc");
	expect(r).toMatchObject({ ok: true, data: { name: "Ania" } });
	const cfg = http.request.mock.calls[0][0];
	expect(cfg).toMatchObject({ method: "get", url: "users/me" });
	expect(cfg.headers.Authorization).toBe("Bearer abc");
});

test("logoutRequest deletes users/me with bearer token", async () => {
	respond(200, "");
	const r = await logoutRequest("abc");
	expect(r).toMatchObject({ ok: true, status: 200 });
	const cfg = http.request.mock.calls[0][0];
	expect(cfg).toMatchObject({ method: "delete", url: "users/me" });
	expect(cfg.headers.Authorization).toBe("Bearer abc");
});

test("getPosts returns list", async () => {
	respond(200, { data: [{ _id: 1 }, { _id: 2 }] });
	const r = await getPosts();
	expect(r).toMatchObject({ ok: true, data: [{ _id: 1 }, { _id: 2 }] });
});

test("uploadPhoto posts form data field file", async () => {
	const file = new File(["x"], "a.jpg", { type: "image/jpeg" });
	respond(201, { fileName: "123-ab.jpg" });
	const r = await uploadPhoto("tok", file);
	expect(r).toMatchObject({ ok: true, status: 201, data: "123-ab.jpg" });
	const cfg = http.request.mock.calls[0][0];
	expect(cfg).toMatchObject({ method: "post", url: "posts/upload" });
	expect(cfg.data).toBeInstanceOf(FormData);
	expect(cfg.data.get("file")).toBe(file);
	expect(cfg.headers.Authorization).toBe("Bearer tok");
});

test("add and update use expected status codes", async () => {
	respond(201, { data: { _id: 5 } });
	expect(await addPost("t", { title: "T" })).toMatchObject({ ok: true, data: { _id: 5 } });
	expect(http.request.mock.calls[0][0]).toMatchObject({ method: "post", url: "posts/add", data: { title: "T" } });
	respond(202, { data: { _id: 5, title: "N" } });
	expect(await updatePost("t", { id: 5, title: "N" })).toMatchObject({ ok: true, data: { title: "N" } });
	expect(http.request.mock.calls[1][0]).toMatchObject({ method: "put", url: "posts" });
	respond(200, { data: { _id: 5 } });
	expect((await addPost("t", {})).ok).toBe(false);
});

test("401 marks unauthorized", async () => {
	respond(401, { message: "Brak autoryzacji - zaloguj się ponownie" });
	const r = await deletePost("t", 7);
	expect(r).toMatchObject({ ok: false, status: 401, unauthorized: true });
	expect(http.request.mock.calls[0][0]).toMatchObject({ method: "delete", url: "posts/7" });
});

test("network error resolves with message", async () => {
	http.request.mockRejectedValueOnce(new Error("Network Error"));
	const r = await getPosts();
	expect(r).toEqual({ ok: false, status: 0, data: null, message: "Brak połączenia z serwerem", unauthorized: false });
});

test("200 with unexpected body is treated as error", async () => {
	respond(200, "<!doctype html><html></html>");
	expect(await getMe("t")).toMatchObject({ ok: false, status: 200, message: "Nieprawidłowa odpowiedź serwera" });
	respond(200, { data: "nie-lista" });
	expect(await getPosts()).toMatchObject({ ok: false, message: "Nieprawidłowa odpowiedź serwera" });
	respond(200, { status: 200 });
	expect(await loginRequest("a", "b")).toMatchObject({ ok: false, message: "Nieprawidłowa odpowiedź serwera" });
});
