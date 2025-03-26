import { useContext } from 'react';
import { ACCOUNTANT_CONTENT } from '../../content/account-content';
import { DarkModeContext } from '../../contexts/dark-mode.context';
import styles from './account-page.module.scss';

const AccountPage = () => {
	const { isDarkModeActive } = useContext(DarkModeContext);

	const accountItems = ACCOUNTANT_CONTENT.map((item) => (
		<div className={styles.accountItem}>
			<h3>{item.title}</h3>
			<p>{item.text}</p>
		</div>
	));

	return (
		<div className={`${!isDarkModeActive ? styles.wrapper : styles.wrapperDark}`}>
			<div className={styles.banner}>
				<h1>Księgowość</h1>
			</div>
			<div className={styles.infoConetnt}>
				<h1>Dlaczego warto nam zaufać?</h1>
				<div className={styles.siteTitle}></div>
				<div className={styles.siteContent}>{accountItems}</div>
				<div className={styles.siteContent}>{accountItems}</div>
				<a href="/contact">Skontaktuj się już dziś!</a>
			</div>
		</div>
	);
};

export default AccountPage;
