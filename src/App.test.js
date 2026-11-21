import { render, screen, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";
import { DarkModeProvider } from "./contexts/dark-mode.context";
import { RodoProvider } from "./contexts/rodo-banner.context";
import { ReservationProvider } from "./contexts/reservation-view.context";
import { PostsProvider } from "./contexts/blog-items.context";
import { getAllPosts } from "./utils/posts.utils";

jest.mock("./utils/posts.utils", () => ({ getAllPosts: jest.fn() }));
jest.mock("./utils/admin.utils", () => ({
	loginRequest: jest.fn(),
	getMe: jest.fn(),
	getPosts: jest.fn(),
	deletePost: jest.fn(),
	uploadPhoto: jest.fn(),
	addPost: jest.fn(),
	updatePost: jest.fn(),
}));

const FOOTER_TEXT = "32-800 Brzesko"; // CONTACT_INFO.companyAdress2, renderowane w stopce

// act: PostsProvider strony publicznej ustawia stan po zapytaniu — czekamy na to w teście
const renderAt = (path) =>
	act(async () => {
		render(
		<MemoryRouter initialEntries={[path]}>
			<DarkModeProvider>
				<RodoProvider>
					<ReservationProvider>
						<PostsProvider>
							<App />
						</PostsProvider>
					</ReservationProvider>
				</RodoProvider>
			</DarkModeProvider>
		</MemoryRouter>
		);
	});

beforeEach(() => {
	// CRA ma resetMocks: true — implementacje mocków ustawiamy przed każdym testem
	getAllPosts.mockResolvedValue({ data: [] });
	sessionStorage.clear();
	document.body.innerHTML = '<div id="modal"></div>';
});

test("admin route renders panel without site footer", async () => {
	await renderAt("/mawexadmin");
	expect(await screen.findByRole("button", { name: "Zaloguj" })).toBeInTheDocument();
	expect(screen.queryByText(FOOTER_TEXT)).not.toBeInTheDocument();
});

test("home still renders footer", async () => {
	await renderAt("/");
	expect((await screen.findAllByText(FOOTER_TEXT)).length).toBeGreaterThan(0);
	expect(screen.queryByRole("button", { name: "Zaloguj" })).not.toBeInTheDocument();
});

test("admin route ignores letter case for footer", async () => {
	await renderAt("/MawexAdmin");
	expect(await screen.findByRole("button", { name: "Zaloguj" })).toBeInTheDocument();
	expect(screen.queryByText(FOOTER_TEXT)).not.toBeInTheDocument();
});
