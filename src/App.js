import { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import {
	Navigation,
	Home,
	Offer,
	SubRoutes,
	CertPage,
	BenefitsPage,
	LawPage,
	ContactPage,
	BlogPage,
	Blog2023Page,
	Blog2024Page,
	ReservationPage,
	CookiePage,
	AccountPage,
} from './routes';
import { Footer, RodoBanner } from './components';
import { OFFERS_NAMES } from './content/offer-content';
import { DarkModeContext } from './contexts/dark-mode.context';

import styles from './app.module.scss';
import TachoServicePage from './routes/tacho-service-page';

const App = () => {
	const { isDarkModeActive } = useContext(DarkModeContext);
	const offerSubRoutes = OFFERS_NAMES.map((item) => (
		<Route key={item.id} path={`/${item.linkPath}`} element={<SubRoutes dataPath={item.linkPath} />} />
	));

	return (
		<div className={`${!isDarkModeActive ? '' : styles.wrapperDark}`}>
			<Routes>
				<Route path="/" element={<Navigation />}>
					<Route index element={<Home />} />
					<Route path="/offer" element={<Offer />} />
					{offerSubRoutes}
					<Route path="/certificates" element={<CertPage />} />
					<Route path="/benefits" element={<BenefitsPage />} />
					<Route path="/law" element={<LawPage />} />
					<Route path="/contact" element={<ContactPage />} />
					<Route path="/blog" element={<BlogPage />} />
					<Route path="/wypozyczalnia" element={<ReservationPage />} />
					<Route path="/ksiegowosc" element={<AccountPage />} />
					<Route path="/tachografy" element={<TachoServicePage />} />
					<Route path="/cookies" element={<CookiePage />} />
					<Route path="/blog-2023" element={<Blog2023Page />} />
					<Route path="/blog-2024" element={<Blog2024Page />} />
					<Route path="*" element={<Navigate to="/" replace />} />
				</Route>
			</Routes>
			<RodoBanner />
			<Footer />
		</div>
	);
};

export default App;

