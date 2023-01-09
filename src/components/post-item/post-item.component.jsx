
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

    const sortedContent1 = content1.split(/\n/);
    const vievContent1 = sortedContent1.map((item, index) => <p key={ index }>{ item }</p>);

    const sortedContent2 = !content2 ? null : content2.split(/\n/);
    const vievContent2 = !sortedContent2 ? "" : sortedContent2.map((item, index) => <p key={ index }>{ item }</p>);

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
                            <div className={ styles.content1 }>
                                { vievContent1 }
                            </div>
                            <div className={ styles.content2 }>
                                { vievContent2 }
                            </div>
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