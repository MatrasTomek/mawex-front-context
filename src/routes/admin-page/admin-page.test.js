import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminPage from "./admin-page.component";
import { DarkModeProvider } from "../../contexts/dark-mode.context";
import * as api from "../../utils/admin.utils";

jest.mock("../../utils/admin.utils", () => ({
	loginRequest: jest.fn(),
	getMe: jest.fn(),
	logoutRequest: jest.fn(),
	getPosts: jest.fn(),
	deletePost: jest.fn(),
	uploadPhoto: jest.fn(),
	addPost: jest.fn(),
	updatePost: jest.fn(),
}));

const KEY = "mawexAdminSession";
const ok = (data, status = 200) => ({ ok: true, status, data, message: null, unauthorized: false });
const fail = (status, message) => ({ ok: false, status, data: null, message, unauthorized: status === 401 });
const user = { id: 1, user: "a@b.pl", access: "admin", name: "Ania" };
const postA = { _id: 1, title: "A", content1: "a", content2: "", link: "", userName: "Ania", date: "2026-11-01", imgPath: "images/blog/a.jpg" };
const postB = { _id: 2, title: "B", content1: "b", content2: "", link: "", userName: "Ania", date: "2026-11-10", imgPath: "images/blog/b.jpg" };

const renderPage = () =>
	render(
		<DarkModeProvider>
			<AdminPage />
		</DarkModeProvider>
	);

const loggedIn = () => {
	sessionStorage.setItem(KEY, JSON.stringify({ token: "tok", user }));
	api.getMe.mockResolvedValue(ok(user));
};

beforeEach(() => {
	sessionStorage.clear();
	Object.values(api).filter((fn) => typeof fn === "function" && fn.mockReset).forEach((fn) => fn.mockReset());
	document.body.innerHTML = '<div id="modal"></div>';
	api.getPosts.mockResolvedValue(ok([postA, postB]));
});

test("shows login form when anonymous", () => {
	renderPage();
	expect(screen.getByLabelText("Login")).toBeInTheDocument();
	expect(screen.getByLabelText("Hasło")).toBeInTheDocument();
	expect(screen.getByRole("button", { name: "Zaloguj" })).toBeInTheDocument();
	expect(api.getPosts).not.toHaveBeenCalled();
});

test("login error shows backend message", async () => {
	api.loginRequest.mockResolvedValue(fail(404, "Login lub hasło się nie zgadza"));
	renderPage();
	userEvent.type(screen.getByLabelText("Login"), "a@b.pl");
	userEvent.type(screen.getByLabelText("Hasło"), "zle");
	userEvent.click(screen.getByRole("button", { name: "Zaloguj" }));
	expect(await screen.findByText("Login lub hasło się nie zgadza")).toBeInTheDocument();
	expect(api.loginRequest).toHaveBeenCalledWith("a@b.pl", "zle");
});

test("login requires both fields", async () => {
	renderPage();
	userEvent.click(screen.getByRole("button", { name: "Zaloguj" }));
	expect(await screen.findAllByText("Pole wymagane")).toHaveLength(2);
	expect(api.loginRequest).not.toHaveBeenCalled();
});

test("successful login shows panel", async () => {
	api.loginRequest.mockResolvedValue(ok({ ...user, token: "T", loginId: "T" }));
	renderPage();
	userEvent.type(screen.getByLabelText("Login"), "a@b.pl");
	userEvent.type(screen.getByLabelText("Hasło"), "pw");
	userEvent.click(screen.getByRole("button", { name: "Zaloguj" }));
	expect(await screen.findByText("Panel Mawex — blog")).toBeInTheDocument();
	expect(await screen.findByText("B")).toBeInTheDocument();
});

test("authenticated shows posts newest first", async () => {
	loggedIn();
	renderPage();
	await screen.findByText("Panel Mawex — blog");
	const items = await screen.findAllByRole("listitem");
	expect(within(items[0]).getByText("B")).toBeInTheDocument();
	expect(within(items[1]).getByText("A")).toBeInTheDocument();
	expect(within(items[0]).getByRole("img")).toHaveAttribute("src", "/images/blog/b.jpg");
	expect(screen.getByText("Ania", { selector: "[data-role=user]" })).toBeInTheDocument();
});

test("list network error shows retry", async () => {
	loggedIn();
	api.getPosts.mockResolvedValueOnce(fail(0, "Brak połączenia z serwerem"));
	renderPage();
	expect(await screen.findByText("Brak połączenia z serwerem")).toBeInTheDocument();
	userEvent.click(screen.getByRole("button", { name: "Spróbuj ponownie" }));
	expect(await screen.findByText("B")).toBeInTheDocument();
	expect(api.getPosts).toHaveBeenCalledTimes(2);
});

test("delete asks for confirmation", async () => {
	loggedIn();
	api.deletePost.mockResolvedValue(ok(null));
	renderPage();
	const items = await screen.findAllByRole("listitem");
	userEvent.click(within(items[0]).getByRole("button", { name: "Usuń" }));
	expect(screen.getByText("Usunąć post „B”?")).toBeInTheDocument();
	userEvent.click(screen.getByRole("button", { name: "Anuluj" }));
	expect(api.deletePost).not.toHaveBeenCalled();
	expect(screen.queryByText("Usunąć post „B”?")).not.toBeInTheDocument();

	userEvent.click(within(items[0]).getByRole("button", { name: "Usuń" }));
	const dialog = screen.getByText("Usunąć post „B”?").closest("[data-role=confirm]");
	userEvent.click(within(dialog).getByRole("button", { name: "Usuń" }));
	await waitFor(() => expect(screen.queryByText("B")).not.toBeInTheDocument());
	expect(api.deletePost).toHaveBeenCalledWith("tok", 2);
	expect(screen.getByText("A")).toBeInTheDocument();
});

test("401 on delete returns to login with notice", async () => {
	loggedIn();
	api.deletePost.mockResolvedValue(fail(401, "Brak autoryzacji"));
	renderPage();
	const items = await screen.findAllByRole("listitem");
	userEvent.click(within(items[0]).getByRole("button", { name: "Usuń" }));
	const dialog = screen.getByText("Usunąć post „B”?").closest("[data-role=confirm]");
	userEvent.click(within(dialog).getByRole("button", { name: "Usuń" }));
	expect(await screen.findByText("Sesja wygasła — zaloguj się ponownie")).toBeInTheDocument();
	expect(screen.getByLabelText("Login")).toBeInTheDocument();
	expect(sessionStorage.getItem(KEY)).toBeNull();
	expect(api.logoutRequest).not.toHaveBeenCalled();
});

test("logout returns to login", async () => {
	loggedIn();
	renderPage();
	await screen.findByText("Panel Mawex — blog");
	userEvent.click(screen.getByRole("button", { name: "Wyloguj" }));
	expect(screen.getByLabelText("Login")).toBeInTheDocument();
	expect(sessionStorage.getItem(KEY)).toBeNull();
	expect(api.logoutRequest).toHaveBeenCalledTimes(1);
	expect(api.logoutRequest).toHaveBeenCalledWith("tok");
});

test("logout does not wait for server", async () => {
	loggedIn();
	api.logoutRequest.mockReturnValue(new Promise(() => {}));
	renderPage();
	await screen.findByText("Panel Mawex — blog");
	userEvent.click(screen.getByRole("button", { name: "Wyloguj" }));
	expect(screen.getByLabelText("Login")).toBeInTheDocument();
});

test("added post appears at top of list", async () => {
	loggedIn();
	global.URL.createObjectURL = jest.fn(() => "blob:x");
	global.URL.revokeObjectURL = jest.fn();
	api.uploadPhoto.mockResolvedValue(ok("9-a.jpg", 201));
	api.addPost.mockResolvedValue(ok({ _id: 3, title: "C", content1: "c", content2: "", link: "", userName: "Ania", date: "2026-11-19", imgPath: "images/blog/9-a.jpg" }, 201));
	renderPage();
	await screen.findAllByRole("listitem");
	userEvent.click(screen.getByRole("button", { name: "+ Dodaj post" }));
	expect(screen.getByLabelText("Podpis")).toHaveValue("Ania");
	userEvent.upload(screen.getByLabelText("Zdjęcie"), new File(["x"], "c.jpg", { type: "image/jpeg" }));
	userEvent.type(screen.getByLabelText("Tytuł"), "C");
	userEvent.type(screen.getByLabelText("Tekst 1"), "c");
	userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
	await waitFor(() => expect(screen.queryByLabelText("Tytuł")).not.toBeInTheDocument());
	const items = screen.getAllByRole("listitem");
	expect(items).toHaveLength(3);
	expect(within(items[0]).getByText("C")).toBeInTheDocument();
});

test("edited post is replaced in list", async () => {
	loggedIn();
	api.updatePost.mockResolvedValue(ok({ ...postA, title: "A2" }, 202));
	renderPage();
	const items = await screen.findAllByRole("listitem");
	userEvent.click(within(items[1]).getByRole("button", { name: "Edytuj" }));
	expect(screen.getByLabelText("Tytuł")).toHaveValue("A");
	userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
	expect(await screen.findByText("A2")).toBeInTheDocument();
	expect(screen.getAllByRole("listitem")).toHaveLength(2);
	expect(api.updatePost).toHaveBeenCalledWith("tok", expect.objectContaining({ id: 1 }));
});

test("relogin from expired form returns to login", async () => {
	loggedIn();
	api.updatePost.mockResolvedValue(fail(401, "Brak autoryzacji"));
	renderPage();
	const items = await screen.findAllByRole("listitem");
	userEvent.click(within(items[0]).getByRole("button", { name: "Edytuj" }));
	userEvent.click(screen.getByRole("button", { name: "Zapisz" }));
	userEvent.click(await screen.findByRole("button", { name: "Zaloguj ponownie" }));
	expect(screen.getByLabelText("Login")).toBeInTheDocument();
	expect(screen.getByText("Sesja wygasła — zaloguj się ponownie")).toBeInTheDocument();
});

test("failed login replaces the session-expired notice", async () => {
	sessionStorage.setItem(KEY, JSON.stringify({ token: "tok", user }));
	api.getMe.mockResolvedValue(fail(401, "Brak autoryzacji"));
	api.loginRequest.mockResolvedValue(fail(404, "Login lub hasło się nie zgadza"));
	renderPage();
	expect(await screen.findByText("Sesja wygasła — zaloguj się ponownie")).toBeInTheDocument();
	userEvent.type(screen.getByLabelText("Login"), "a@b.pl");
	userEvent.type(screen.getByLabelText("Hasło"), "zle");
	userEvent.click(screen.getByRole("button", { name: "Zaloguj" }));
	expect(await screen.findByText("Login lub hasło się nie zgadza")).toBeInTheDocument();
	expect(screen.queryByText("Sesja wygasła — zaloguj się ponownie")).not.toBeInTheDocument();
});

test("delete of already removed post (404) drops it from list", async () => {
	loggedIn();
	api.deletePost.mockResolvedValue(fail(404, "Nie ma postu do usunięcia"));
	renderPage();
	const items = await screen.findAllByRole("listitem");
	userEvent.click(within(items[0]).getByRole("button", { name: "Usuń" }));
	const dialog = screen.getByText("Usunąć post „B”?").closest("[data-role=confirm]");
	userEvent.click(within(dialog).getByRole("button", { name: "Usuń" }));
	await waitFor(() => expect(screen.queryByText("Usunąć post „B”?")).not.toBeInTheDocument());
	expect(screen.getAllByRole("listitem")).toHaveLength(1);
	expect(screen.queryByText("B")).not.toBeInTheDocument();
});

test("modal takes focus, closes on Escape and gives focus back", async () => {
	loggedIn();
	renderPage();
	await screen.findAllByRole("listitem");
	const opener = screen.getByRole("button", { name: "+ Dodaj post" });
	opener.focus();
	userEvent.click(opener);
	const dialog = screen.getByRole("dialog");
	expect(dialog).toHaveAttribute("aria-modal", "true");
	expect(dialog.contains(document.activeElement)).toBe(true);
	userEvent.keyboard("{Escape}");
	expect(screen.queryByLabelText("Tytuł")).not.toBeInTheDocument();
	expect(document.activeElement).toBe(opener);
});

test("admin modals get the bordered style", async () => {
	loggedIn();
	renderPage();
	const items = await screen.findAllByRole("listitem");
	userEvent.click(within(items[0]).getByRole("button", { name: "Usuń" }));
	expect(screen.getByRole("dialog").parentElement.className).toMatch(/bordered/);
});
