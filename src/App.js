import { Routes, Route } from "react-router-dom";
import { Navigation, Home, Offer, SubRoutes } from "./routes";
import { Footer } from "./components";
import { OFFERS_NAMES } from "./content/offer-content";

const App = () => {
	const offerSubRoutes = OFFERS_NAMES.map((item) => (
		<Route key={item.id} path={`/${item.linkPath}`} element={<SubRoutes dataPath={item.linkPath} />} />
	));

	return (
		<>
			<Routes>
				<Route path="/" element={<Navigation />}>
					<Route index element={<Home />} />
					<Route path="/offer" element={<Offer />} />
					{offerSubRoutes}
					{/* <Route path="shop/*" element={<Shop />} />
					<Route path="auth" element={<Authentication />} />
					<Route path="checkout" element={<Checkout />} /> */}
				</Route>
			</Routes>
			<Footer />
		</>
	);
};

export default App;
