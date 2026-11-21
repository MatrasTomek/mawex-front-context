import { StrictMode } from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PostForm from "./post-form.component";
import { uploadPhoto, addPost, updatePost } from "../../../utils/admin.utils";

jest.mock("../../../utils/admin.utils", () => ({ uploadPhoto: jest.fn(), addPost: jest.fn(), updatePost: jest.fn() }));

const ok = (data, status = 201) => ({ ok: true, status, data, message: null, unauthorized: false });
const fail = (status, message) => ({ ok: false, status, data: null, message, unauthorized: status === 401 });
const jpg = () => new File(["jpgdata"], "foto.jpg", { type: "image/jpeg" });
const today = () => {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const existing = { _id: 7, title: "Stary", content1: "Treść", content2: null, link: null, userName: "Ola", date: "2026-01-05", imgPath: "images/blog/old.jpg" };

let props;
const renderForm = (post = null) => {
	props = { post, token: "tok", defaultUserName: "Ania", onSaved: jest.fn(), onCancel: jest.fn(), onUnauthorized: jest.fn() };
	return render(<PostForm {...props} />);
};
const fillNew = () => {
	userEvent.upload(screen.getByLabelText("Zdjęcie"), jpg());
	userEvent.type(screen.getByLabelText("Tytuł"), "Nowy post");
	userEvent.type(screen.getByLabelText("Tekst 1"), "Akapit");
};
const save = () => userEvent.click(screen.getByRole("button", { name: /Zapis/ }));

beforeEach(() => {
	document.body.innerHTML = '<div id="modal"></div>';
	[uploadPhoto, addPost, updatePost].forEach((f) => f.mockReset());
	global.URL.createObjectURL = jest.fn(() => "blob:x");
	global.URL.revokeObjectURL = jest.fn();
});

test("new post requires photo and fields", async () => {
	renderForm();
	userEvent.clear(screen.getByLabelText("Podpis"));
	save();
	expect(await screen.findAllByText("Pole wymagane")).toHaveLength(3); // Tytuł, Tekst 1, Podpis
	expect(screen.getByText("Dodaj zdjęcie")).toBeInTheDocument();
	expect(uploadPhoto).not.toHaveBeenCalled();
	expect(addPost).not.toHaveBeenCalled();
});

test("new post defaults date and signature", () => {
	renderForm();
	expect(screen.getByLabelText("Data")).toHaveValue(today());
	expect(screen.getByLabelText("Podpis")).toHaveValue("Ania");
});

test("new post uploads then adds with imgPath", async () => {
	uploadPhoto.mockResolvedValue(ok("123-ab.jpg"));
	addPost.mockResolvedValue(ok({ _id: 9, title: "Nowy post" }));
	renderForm();
	fillNew();
	save();
	await waitFor(() => expect(props.onSaved).toHaveBeenCalledWith({ _id: 9, title: "Nowy post" }));
	expect(uploadPhoto).toHaveBeenCalledWith("tok", expect.any(File));
	expect(addPost).toHaveBeenCalledWith("tok", {
		title: "Nowy post",
		content1: "Akapit",
		content2: "",
		link: "",
		userName: "Ania",
		date: today(),
		imgPath: "images/blog/123-ab.jpg",
	});
	expect(uploadPhoto.mock.invocationCallOrder[0]).toBeLessThan(addPost.mock.invocationCallOrder[0]);
});

test("edit without new photo keeps imgPath", async () => {
	updatePost.mockResolvedValue(ok({ ...existing, title: "Zmieniony" }, 202));
	renderForm(existing);
	expect(screen.getByRole("img")).toHaveAttribute("src", "/images/blog/old.jpg");
	userEvent.clear(screen.getByLabelText("Tytuł"));
	userEvent.type(screen.getByLabelText("Tytuł"), "Zmieniony");
	save();
	await waitFor(() => expect(props.onSaved).toHaveBeenCalled());
	expect(uploadPhoto).not.toHaveBeenCalled();
	expect(updatePost).toHaveBeenCalledWith("tok", expect.objectContaining({ id: 7, title: "Zmieniony", imgPath: "images/blog/old.jpg" }));
});

test("edit with null fields sends empty strings", async () => {
	updatePost.mockResolvedValue(ok(existing, 202));
	renderForm(existing);
	expect(screen.getByLabelText("Tekst 2")).toHaveValue("");
	expect(screen.getByLabelText("Link do artykułu")).toHaveValue("");
	save();
	await waitFor(() => expect(props.onSaved).toHaveBeenCalled());
	expect(updatePost.mock.calls[0][1]).toEqual({
		id: 7,
		title: "Stary",
		content1: "Treść",
		content2: "",
		link: "",
		userName: "Ola",
		date: "2026-01-05",
		imgPath: "images/blog/old.jpg",
	});
});

test("rejects wrong file type and too big file", async () => {
	renderForm();
	userEvent.upload(screen.getByLabelText("Zdjęcie"), new File(["x"], "a.txt", { type: "text/plain" }), undefined, { applyAccept: false });
	expect(screen.getByText("Dozwolone: JPG, PNG, WEBP, GIF")).toBeInTheDocument();
	const big = jpg();
	Object.defineProperty(big, "size", { value: 10 * 1024 * 1024 + 1 });
	userEvent.upload(screen.getByLabelText("Zdjęcie"), big);
	expect(screen.getByText("Plik jest za duży (max 10 MB)")).toBeInTheDocument();
	userEvent.type(screen.getByLabelText("Tytuł"), "T");
	userEvent.type(screen.getByLabelText("Tekst 1"), "c");
	save();
	expect(await screen.findByText("Dodaj zdjęcie")).toBeInTheDocument();
	expect(uploadPhoto).not.toHaveBeenCalled();
});

test("blocks double submit", async () => {
	let resolveUpload;
	uploadPhoto.mockReturnValue(new Promise((r) => (resolveUpload = r)));
	addPost.mockResolvedValue(ok({ _id: 9 }));
	renderForm();
	fillNew();
	save();
	save();
	fireEvent.submit(screen.getByLabelText("Tytuł").closest("form")); // z pominięciem wyłączonego przycisku
	await waitFor(() => expect(uploadPhoto).toHaveBeenCalledTimes(1));
	expect(screen.getByRole("button", { name: /Zapis/ })).toBeDisabled();
	resolveUpload(ok("1-a.jpg"));
	await waitFor(() => expect(props.onSaved).toHaveBeenCalledTimes(1));
	expect(uploadPhoto).toHaveBeenCalledTimes(1);
	expect(addPost).toHaveBeenCalledTimes(1);
});

test("retry after failed save reuses uploaded file", async () => {
	uploadPhoto.mockResolvedValue(ok("123-ab.jpg"));
	addPost.mockResolvedValueOnce(fail(500, "X")).mockResolvedValueOnce(ok({ _id: 9 }));
	renderForm();
	fillNew();
	save();
	expect(await screen.findByText("X")).toBeInTheDocument();
	expect(screen.getByLabelText("Tytuł")).toHaveValue("Nowy post");
	save();
	await waitFor(() => expect(props.onSaved).toHaveBeenCalled());
	expect(uploadPhoto).toHaveBeenCalledTimes(1);
	expect(addPost).toHaveBeenCalledTimes(2);
	expect(addPost.mock.calls[1][1].imgPath).toBe("images/blog/123-ab.jpg");
});

test("upload error keeps form and shows message", async () => {
	uploadPhoto.mockResolvedValue(fail(400, "Niedozwolony typ pliku"));
	renderForm();
	fillNew();
	save();
	expect(await screen.findByText("Niedozwolony typ pliku")).toBeInTheDocument();
	expect(addPost).not.toHaveBeenCalled();
	expect(screen.getByLabelText("Tytuł")).toHaveValue("Nowy post");
});

test("401 on save keeps form content until relogin", async () => {
	uploadPhoto.mockResolvedValue(ok("1-a.jpg"));
	addPost.mockResolvedValue(fail(401, "Brak autoryzacji"));
	renderForm();
	fillNew();
	save();
	expect(await screen.findByText("Sesja wygasła — skopiuj treść przed ponownym logowaniem")).toBeInTheDocument();
	expect(screen.getByLabelText("Tytuł")).toHaveValue("Nowy post");
	expect(props.onUnauthorized).not.toHaveBeenCalled();
	userEvent.click(screen.getByRole("button", { name: "Zaloguj ponownie" }));
	expect(props.onUnauthorized).toHaveBeenCalledTimes(1);
});

test("cancel closes without saving", () => {
	renderForm();
	userEvent.click(screen.getByRole("button", { name: "Anuluj" }));
	expect(props.onCancel).toHaveBeenCalled();
});

test("cancel after 401 also returns to login", async () => {
	uploadPhoto.mockResolvedValue(ok("1-a.jpg"));
	addPost.mockResolvedValue(fail(401, "Brak autoryzacji"));
	renderForm();
	fillNew();
	save();
	await screen.findByText("Sesja wygasła — skopiuj treść przed ponownym logowaniem");
	userEvent.click(screen.getByRole("button", { name: "Anuluj" }));
	expect(props.onUnauthorized).toHaveBeenCalledTimes(1);
	expect(props.onCancel).not.toHaveBeenCalled();
});

test("rejected file is cleared from the input", () => {
	renderForm();
	userEvent.upload(screen.getByLabelText("Zdjęcie"), new File(["x"], "a.txt", { type: "text/plain" }), undefined, { applyAccept: false });
	expect(screen.getByText("Dozwolone: JPG, PNG, WEBP, GIF")).toBeInTheDocument();
	expect(screen.getByLabelText("Zdjęcie").files).toHaveLength(0);
});

test("preview URLs are valid and all released under StrictMode", () => {
	let n = 0;
	global.URL.createObjectURL = jest.fn(() => `blob:${++n}`);
	props = { post: null, token: "tok", defaultUserName: "Ania", onSaved: jest.fn(), onCancel: jest.fn(), onUnauthorized: jest.fn() };
	const { unmount } = render(
		<StrictMode>
			<PostForm {...props} />
		</StrictMode>
	);
	userEvent.upload(screen.getByLabelText("Zdjęcie"), jpg());
	const src = document.querySelector("#modal img").getAttribute("src");
	expect(src).toMatch(/^blob:/);
	expect(global.URL.revokeObjectURL).not.toHaveBeenCalledWith(src);
	unmount();
	// każdy utworzony URL zostaje zwolniony — także te z podwójnego renderu StrictMode
	const created = global.URL.createObjectURL.mock.results.map((r) => r.value);
	const revoked = global.URL.revokeObjectURL.mock.calls.map((c) => c[0]);
	expect(created.filter((url) => !revoked.includes(url))).toEqual([]);
});
