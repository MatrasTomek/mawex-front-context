import React from "react";
import styles from "./spinner.module.scss";

const Spinner = (isOpen) => {

    return (
        <div className={ styles.ldsRing } style={ { display: `${ !isOpen ? "none" : "inline-block" }` } }><div></div><div></div><div></div><div></div></div>
    );
};

export default React.memo(Spinner);