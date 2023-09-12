import { useContext } from "react";
import { BlogItemsContext } from "../../contexts/blog-items.context";
import { PostItem, Spinner } from "../../components";
import { DarkModeContext } from "../../contexts/dark-mode.context";
import styles from "./blog-page.module.scss";

const BlogPage = () => {

    const { isDarkModeActive } = useContext(DarkModeContext);
    const posts = useContext(BlogItemsContext);
    const postsViev = !posts.data ? "" : (
        posts.data.map((item) => (
            <PostItem key={ item._id } postItem={ item } homePage={ false } />
        )).reverse()
    );

    return (
        <div  className={ `${ !isDarkModeActive ? styles.blogWrapper : styles.blogWrapperDark }` }>
            { !posts.data ? (
                <div className={ styles.spinner }>
                    <h4>Poczekaj na załadowanie elementów Blog-a...</h4>
                    <Spinner isOpen={ !posts.data ? false : true } />
                </div>
            ) : (
                postsViev
            ) }
        </div>
    );

};

export default BlogPage;