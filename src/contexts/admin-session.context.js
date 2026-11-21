import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, loginRequest, logoutRequest } from "../utils/admin.utils";

// Sesja panelu /mawexadmin. Token z sessionStorage NIE wystarcza do pokazania panelu:
// przy starcie jest sprawdzany w backendzie (GET users/me), a do czasu odpowiedzi status = "checking".
const KEY = "mawexAdminSession";
export const SESSION_EXPIRED = "Sesja wygasła — zaloguj się ponownie";

const readStored = () => {
	let raw = null;
	try {
		raw = sessionStorage.getItem(KEY);
		if (raw === null) return null;
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed.token === "string" && parsed.token !== "") return parsed;
	} catch (e) {
		// uszkodzony wpis — traktujemy jak brak sesji
	}
	try {
		sessionStorage.removeItem(KEY);
	} catch (e) {}
	return null;
};

const writeStored = (value) => {
	try {
		if (value) sessionStorage.setItem(KEY, JSON.stringify(value));
		else sessionStorage.removeItem(KEY);
	} catch (e) {}
};

const userFields = ({ id, user, access, name }) => ({ id, user, access, name });

const AdminSessionContext = createContext(null);

export const AdminSessionProvider = ({ children }) => {
	const [state, setState] = useState(() => {
		const stored = readStored();
		return stored
			? { status: "checking", token: stored.token, user: null, notice: null }
			: { status: "anonymous", token: null, user: null, notice: null };
	});

	const pendingToken = state.status === "checking" ? state.token : null;

	useEffect(() => {
		if (!pendingToken) return undefined;
		let active = true;
		getMe(pendingToken).then((res) => {
			if (!active) return;
			if (res.ok) {
				const user = userFields(res.data);
				writeStored({ token: pendingToken, user });
				setState({ status: "authenticated", token: pendingToken, user, notice: null });
			} else if (res.unauthorized) {
				writeStored(null);
				setState({ status: "anonymous", token: null, user: null, notice: SESSION_EXPIRED });
			} else {
				// np. brak sieci — nie kasujemy zapisanej sesji, można spróbować po odświeżeniu
				setState({ status: "anonymous", token: null, user: null, notice: res.message });
			}
		});
		return () => {
			active = false;
		};
	}, [pendingToken]);

	const login = useCallback(async (login, password) => {
		// nowa próba logowania — stary komunikat (np. „Sesja wygasła”) już nie dotyczy
		setState((s) => (s.notice ? { ...s, notice: null } : s));
		const res = await loginRequest(login, password);
		if (!res.ok) return { ok: false, message: res.message };
		const user = userFields(res.data);
		writeStored({ token: res.data.token, user });
		setState({ status: "authenticated", token: res.data.token, user, notice: null });
		return { ok: true, message: null };
	}, []);

	const logout = useCallback((notice = null) => {
		writeStored(null);
		setState({ status: "anonymous", token: null, user: null, notice });
	}, []);

	// Wylogowanie przyciskiem: token unieważniany w backendzie w tle — bez czekania na odpowiedź,
	// bo sesja lokalna i tak znika. (Przy wygaśnięciu sesji wołamy samo logout — token już nie działa.)
	const { token } = state;
	const signOut = useCallback(() => {
		if (token) logoutRequest(token);
		logout();
	}, [token, logout]);

	const value = useMemo(() => ({ ...state, login, logout, signOut }), [state, login, logout, signOut]);
	return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
};

export const useAdminSession = () => useContext(AdminSessionContext);
