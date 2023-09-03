import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { DarkModeContext } from '../../contexts/dark-mode.context';
import styles from "./min-post-item.module.scss";

const MinPostItem = React.memo(({ postItem }) => {

    const { isDarkModeActive } = useContext(DarkModeContext);

    const { title, date, userName } = postItem;

    return (

        <Link to="/blog" className={ `${ !isDarkModeActive ? styles.minPostWrapper : styles.minPostWrapperDark }` }>
            <div className={ styles.inside }>
                <h4>{ title }</h4>
                <p>{ date }</p>
                <p>{ userName }</p>
                <p>zobacz</p>
            </div>
        </Link>
    );
});

export default MinPostItem;