import { Routes, Route } from "react-router-dom";
import { Navigation, Home } from "./routes";

const App = () => {
	return (
		<>
			<Routes>
				<Route path="/" element={<Navigation />}>
					<Route index element={<Home />} />
					{/* <Route path="shop/*" element={<Shop />} />
					<Route path="auth" element={<Authentication />} />
					<Route path="checkout" element={<Checkout />} /> */}
				</Route>
			</Routes>
		</>
	);
};

export default App;
