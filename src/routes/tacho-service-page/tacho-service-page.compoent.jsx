import { useContext } from 'react';
import { DarkModeContext } from '../../contexts/dark-mode.context';
import styles from './tacho-service-page.module.scss';

const TachoServicePage = () => {
	const { isDarkModeActive } = useContext(DarkModeContext);

	return (
		<div className={`${!isDarkModeActive ? styles.wrapper : styles.wrapperDark}`}>
			<div className={styles.banner}>
				<h1>Serwis Tachografów</h1>
			</div>
			<div className={styles.infoConetnt}></div>
		</div>
	);
};

export default TachoServicePage;
