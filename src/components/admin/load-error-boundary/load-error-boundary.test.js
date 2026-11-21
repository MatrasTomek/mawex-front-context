import { render, screen } from "@testing-library/react";
import LoadErrorBoundary from "./load-error-boundary.component";

const Broken = () => {
	throw new Error("Loading chunk 872 failed");
};

test("shows reload message when child fails", () => {
	jest.spyOn(console, "error").mockImplementation(() => {});
	render(
		<LoadErrorBoundary>
			<Broken />
		</LoadErrorBoundary>
	);
	expect(screen.getByText("Nie udało się załadować panelu.")).toBeInTheDocument();
	expect(screen.getByRole("button", { name: "Odśwież stronę" })).toBeInTheDocument();
});

test("renders children when nothing fails", () => {
	render(
		<LoadErrorBoundary>
			<p>panel</p>
		</LoadErrorBoundary>
	);
	expect(screen.getByText("panel")).toBeInTheDocument();
});
