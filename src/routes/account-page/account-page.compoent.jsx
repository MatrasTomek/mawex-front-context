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
				<div className={styles.contactInfoWrapper}>
					<span className={styles.contactPhone}>
						Skontaktuj się już dziś:
						<a href={`tel:${'+48 793 272 000'}`}>
							<span>{'+48 793 272 000'}</span>
						</a>
					</span>
					<div className={styles.linkButtonWrapper}>
						<a className={styles.linkButton} href="/contact">
							Lub skorzystaj z formularza
						</a>
					</div>
				</div>
				<div className={styles.siteContent}>{accountItems}</div>
			</div>
			<div className={styles.offerInfoWrapper}>
				<h3>
					Zapraszamy do zapoznania sią z Naszą ofertą na{' '}
					<a className={styles.aButton} target="blank" href="https://g.co/kgs/p2LDJ1P">
						Google
					</a>
				</h3>
			</div>
		</div>
	);
};

export default AccountPage;
