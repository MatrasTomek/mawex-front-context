
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components";
import styles from "./post-item.module.scss";

const PostItem = ({ postItem, homePage }) => {

    const { title, content1, content2, date, imgPath, link, userName } = postItem;

    const [isTextShow, setIsTextShow] = useState(false);

    const handleShowMoreText = () => {
        setIsTextShow(!isTextShow);
    };

    return (
        <div className={ styles.postWrapper }>
            <div className={ styles.inside }>
                <img src={ `${ imgPath }` } alt={ `${ imgPath }` } />
                <div className={ styles.contents }>
                    <h4>{ title }</h4>

                    { !isTextShow ? (
                        <p>{ content1.substring(0, 120) } . . .</p>
                    ) : (
                        <>
                            <p>{ content1 }</p>
                            <p>{ content2 }</p>
                        </>
                    ) }

                    { homePage ? (
                        <Link to="/blog">czytaj dalej</Link>
                    ) : (
                        <Button type="button" name={ !isTextShow ? "więcej" : "mniej" } onClick={ handleShowMoreText } />
                    ) }

                    { link === "" || link === null ? "" : (<a href={ `${ link }` }>Link do artykułu</a>) }
                </div>
                <div className={ styles.signature }>
                    <p>{ date }</p>
                    <p>{ userName }</p>
                </div>
            </div>
        </div>
    );

};

export default PostItem;