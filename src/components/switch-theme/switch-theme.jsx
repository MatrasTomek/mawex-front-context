import React, { useState } from 'react';
import styles from "./switch-theme.module.scss";

const SwitchTheme = () => {
    const [darkThemeOff, setDarkThemeOff] = useState(true);

    const handleChangeTheme = () => {
        setDarkThemeOff(!darkThemeOff);
    };

    return (
        <div className={ styles.switchWrapper } onClick={ handleChangeTheme }>
            <div className={ styles.switchContent }>
                <div className={ styles.dark }></div>
                <div className={ styles.light }></div>
            </div>
            <div className={ styles.switchDot } style={ { left: `${ !darkThemeOff ? "50%" : "0" }` } }></div>
        </div>
    );
};

export default React.memo(SwitchTheme);