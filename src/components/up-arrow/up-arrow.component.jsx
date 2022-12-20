import React, { useEffect, useState } from 'react';
import styles from "./up-arrow.module.scss";

const UpArrow = () => {
    const [windowScroll, setWindowScroll] = useState(false);

    const handdleGoToTopSite = () => {
        window.scroll(0, 0);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setWindowScroll(true);
            } else {
                setWindowScroll(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, [setWindowScroll]);

    return (
        <div style={ { display: `${ !windowScroll ? "none" : "block" }` } } className={ styles.arrowWrapper } onClick={ handdleGoToTopSite }>
            <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path d="m14.1 36.75-2.1-2.1 12-12 12 12-2.1 2.1-9.9-9.9Zm0-12.65L12 22l12-12 12 12-2.1 2.1-9.9-9.9Z" /></svg>
        </div>
    );
};

export default React.memo(UpArrow);