import styles from "./post-item.module.scss";

const PostItem = ({ postItem }) => {

    const { title, content1, content2, date, imgPath, link, userName } = postItem;

    return (
        <div className={ styles.postWrapper }>
            <div className={ styles.inside }>
                <img src={ `${ imgPath }` } alt={ `${ imgPath }` } />
                <div className={ styles.contents }>
                    <h4>{ title }</h4>
                    <p>{ content1 }</p>
                    <p>{ content2 }</p>
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