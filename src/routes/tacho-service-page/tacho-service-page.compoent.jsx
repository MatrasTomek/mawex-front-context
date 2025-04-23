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

				<div className={styles.contactInfoWrapper}>
					<span className={styles.contactPhone}>
						<p> Skontaktuj się już dziś:</p>
						<a href={`tel:${'+48 793 272 000'}`}>
							<span>{'+48 793 272 000'}</span>
						</a>
						<a href={`tel:${'+48 500 814 312'}`}>
							<span>{'+48 500 814 312'}</span>
						</a>
					</span>
					<div className={styles.linkButtonWrapper}>
						<a className={styles.linkButton} href="/contact">
							Lub skorzystaj z formularza
						</a>
					</div>
				</div>
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
				</div>
			</div>
			<div className={styles.offerInfoWrapper}>
				<h3>
					Zapraszamy do zapoznania sią z Naszą ofertą na{' '}
					<a className={styles.aButton} target="blank" href="https://g.co/kgs/3RKW2z7">
						Google
					</a>
				</h3>
			</div>
		</div>
	);
};

export default TachoServicePage;
