import React, { useContext } from 'react';
import { DarkModeContext } from "../../contexts/dark-mode.context";
import styles from "./switch-theme.module.scss";

const SwitchTheme = () => {

    const { isDarkModeActive, setDarkModeActive } =
        useContext(DarkModeContext);

    const handleChangeTheme = () => {
        setDarkModeActive(!isDarkModeActive);
    };

    return (
        <div className={ `${ !isDarkModeActive ? styles.switchWrapper : styles.switchWrapperDark }` } onClick={ handleChangeTheme }>
            <div className={ styles.switchContent }>
                <div className={ styles.dark }></div>
                <div className={ styles.light }></div>
            </div>
            <div className={ styles.switchDot } style={ { top: `${ !isDarkModeActive ? "50%" : "0" }`, } }></div>
        </div>
    );
};

export default React.memo(SwitchTheme);