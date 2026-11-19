import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AdminSessionProvider, useAdminSession } from "./admin-session.context";
import { loginRequest, getMe } from "../utils/admin.utils";

jest.mock("../utils/admin.utils", () => ({ loginRequest: jest.fn(), getMe: jest.fn() }));

const KEY = "mawexAdminSession";
const okMe = (name = "Ania") => ({ ok: true, status: 200, data: { id: 1, user: "a@b.pl", access: "admin", name }, message: null, unauthorized: false });
const unauthorized = { ok: false, status: 401, data: null, message: "Brak autoryzacji", unauthorized: true };

const seen = [];
const Probe = () => {
	const s = useAdminSession();
	seen.push(s.status);
	return (
		<div>
			<p data-testid="status">{s.status}</p>
			<p data-testid="notice">{s.notice || ""}</p>
			<p data-testid="name">{s.user ? s.user.name : ""}</p>
			<button onClick={() => s.login("a@b.pl", "pw")}>login</button>
			<button onClick={() => s.logout("Do zobaczenia")}>logout</button>
		</div>
	);
};

const renderProbe = () =>
	render(
		<AdminSessionProvider>
			<Probe />
		</AdminSessionProvider>
	);

beforeEach(() => {
	sessionStorage.clear();
	seen.length = 0;
	loginRequest.mockReset();
	getMe.mockReset();
});

test("no stored session is anonymous", () => {
	renderProbe();
	expect(screen.getByTestId("status")).toHaveTextContent("anonymous");
	expect(getMe).not.toHaveBeenCalled();
});

test("stored session shows checking then authenticated", async () => {
	sessionStorage.setItem(KEY, JSON.stringify({ token: "tok", user: { name: "Stare" } }));
	getMe.mockResolvedValue(okMe("Ania"));
	renderProbe();
	expect(screen.getByTestId("status")).toHaveTextContent("checking");
	expect(await screen.findByText("authenticated")).toBeInTheDocument();
	expect(getMe).toHaveBeenCalledWith("tok");
	expect(screen.getByTestId("name")).toHaveTextContent("Ania");
});

test("stored token rejected by backend logs out with notice", async () => {
	sessionStorage.setItem(KEY, JSON.stringify({ token: "tok", user: { name: "Ania" } }));
	getMe.mockResolvedValue(unauthorized);
	renderProbe();
	expect(await screen.findByText("anonymous")).toBeInTheDocument();
	expect(screen.getByTestId("notice")).toHaveTextContent("Sesja wygasła — zaloguj się ponownie");
	expect(sessionStorage.getItem(KEY)).toBeNull();
});

test("forged storage value never reaches authenticated", async () => {
	sessionStorage.setItem(KEY, '{"token":"x","user":{"name":"Hacker"}}');
	getMe.mockResolvedValue(unauthorized);
	renderProbe();
	await screen.findByText("anonymous");
	expect(seen).not.toContain("authenticated");
	expect(screen.getByTestId("name")).toHaveTextContent("");
});

test("network error during check keeps storage and shows message", async () => {
	sessionStorage.setItem(KEY, JSON.stringify({ token: "tok", user: { name: "Ania" } }));
	getMe.mockResolvedValue({ ok: false, status: 0, data: null, message: "Brak połączenia z serwerem", unauthorized: false });
	renderProbe();
	expect(await screen.findByText("anonymous")).toBeInTheDocument();
	expect(screen.getByTestId("notice")).toHaveTextContent("Brak połączenia z serwerem");
	expect(sessionStorage.getItem(KEY)).not.toBeNull();
});

test("corrupt storage is ignored", () => {
	sessionStorage.setItem(KEY, "nie-json");
	renderProbe();
	expect(screen.getByTestId("status")).toHaveTextContent("anonymous");
	expect(sessionStorage.getItem(KEY)).toBeNull();
	expect(getMe).not.toHaveBeenCalled();
});

test("login stores session", async () => {
	loginRequest.mockResolvedValue({ ok: true, status: 200, data: { id: 1, user: "a@b.pl", access: "admin", name: "Ania", token: "T", loginId: "T" }, message: null, unauthorized: false });
	renderProbe();
	userEvent.click(screen.getByText("login"));
	expect(await screen.findByText("authenticated")).toBeInTheDocument();
	const stored = JSON.parse(sessionStorage.getItem(KEY));
	expect(stored.token).toBe("T");
	expect(stored.user).toEqual({ id: 1, user: "a@b.pl", access: "admin", name: "Ania" });
});

test("failed login keeps anonymous and returns message", async () => {
	loginRequest.mockResolvedValue({ ok: false, status: 404, data: null, message: "Login lub hasło się nie zgadza", unauthorized: false });
	let result;
	const Caller = () => {
		const s = useAdminSession();
		return <button onClick={async () => (result = await s.login("a", "b"))}>go</button>;
	};
	render(
		<AdminSessionProvider>
			<Caller />
			<Probe />
		</AdminSessionProvider>
	);
	await act(async () => userEvent.click(screen.getByText("go")));
	expect(result).toEqual({ ok: false, message: "Login lub hasło się nie zgadza" });
	expect(screen.getByTestId("status")).toHaveTextContent("anonymous");
	expect(sessionStorage.getItem(KEY)).toBeNull();
});

test("logout clears session with notice", async () => {
	sessionStorage.setItem(KEY, JSON.stringify({ token: "tok", user: { name: "Ania" } }));
	getMe.mockResolvedValue(okMe());
	renderProbe();
	await screen.findByText("authenticated");
	userEvent.click(screen.getByText("logout"));
	expect(screen.getByTestId("status")).toHaveTextContent("anonymous");
	expect(screen.getByTestId("notice")).toHaveTextContent("Do zobaczenia");
	expect(sessionStorage.getItem(KEY)).toBeNull();
});
