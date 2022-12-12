
import { Link } from "react-router-dom";
import styles from "./min-post-item.module.scss";

const MinPostItem = ({ postItem }) => {
    const { title, date, userName } = postItem;

    return (

        <Link to="/" className={ styles.minPostWrapper }>
            <div className={ styles.inside }>
                <h4>{ title }</h4>
                <p>{ date }</p>
                <p>{ userName }</p>
                <p>zobacz</p>
            </div>
        </Link>
    );
};

export default MinPostItem;