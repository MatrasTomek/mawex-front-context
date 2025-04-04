import { useContext } from 'react';
import { DarkModeContext } from '../../contexts/dark-mode.context';
import { TACHO_CONTENT_SERVICE, TACHO_CONTENT_INFO } from '../../content/tacho-service-content';
import styles from './tacho-service-page.module.scss';

const TachoServicePage = () => {
	const { isDarkModeActive } = useContext(DarkModeContext);

	const tachoServiceItems = TACHO_CONTENT_SERVICE.map((item) => <li>{item.text}</li>);
	const tachoInfoItems = TACHO_CONTENT_INFO.map((item) => <li>{item.text}</li>);

	return (
		<div className={`${!isDarkModeActive ? styles.wrapper : styles.wrapperDark}`}>
			<div className={styles.banner}>
				<h1>Serwis Tachografów</h1>
			</div>
			<div className={styles.infoConetnt}>
				<h1>Profesjonalna obsługa tachografów – szybko, sprawnie, zgodnie z przepisami</h1>
				<div className={styles.imageTop}></div>
				<h2>
					W Mawex oferujemy kompleksowy serwis tachografów, obejmujący zarówno urządzenia analogowe, jak i cyfrowe. Dzięki
					wieloletniemu doświadczeniu i nowoczesnemu sprzętowi gwarantujemy najwyższą jakość usług oraz zgodność z obowiązującymi
					przepisami.
				</h2>
				<div className={styles.siteContent}>
					<div className={styles.siteContent__service}>
						<div className={styles.image}>
							<span>Nasze usługi</span>
						</div>
						<ul>{tachoServiceItems}</ul>
					</div>
					<div className={styles.siteContent__info}>
						<div className={styles.image}>
							<span>Nasze zaplecze</span>
						</div>
						<ul>{tachoInfoItems}</ul>
					</div>
				</div>
				<div className={styles.linkButtonWrapper}>
					<h3>
						Nie ryzykuj mandatów i problemów z kontrolą drogową – zaufaj ekspertom! Skontaktuj się z nami i umów na serwis
						tachografu.
					</h3>
					<a className={styles.linkButton} href="/contact">
						Skontaktuj się już dziś!
					</a>
				</div>
			</div>
		</div>
	);
};

export default TachoServicePage;
