import { Component } from "react";

// Gdy paczka panelu się nie pobierze (np. stary chunk po wdrożeniu nowego builda),
// zamiast białego ekranu pokazujemy komunikat z odświeżeniem.
class LoadErrorBoundary extends Component {
	state = { failed: false };

	static getDerivedStateFromError() {
		return { failed: true };
	}

	render() {
		if (!this.state.failed) return this.props.children;
		return (
			<div style={{ maxWidth: 360, margin: "80px auto", padding: "0 16px", textAlign: "center" }}>
				<p>Nie udało się załadować panelu.</p>
				<button type="button" onClick={() => window.location.reload()} style={{ padding: "8px 18px", cursor: "pointer" }}>
					Odśwież stronę
				</button>
			</div>
		);
	}
}

export default LoadErrorBoundary;
