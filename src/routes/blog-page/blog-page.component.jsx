import { useContext } from "react";
import { Link } from "react-router-dom";
import { BlogItemsContext } from "../../contexts/blog-items.context";
import { PostItem, Spinner } from "../../components";
import { DarkModeContext } from "../../contexts/dark-mode.context";
import styles from "./blog-page.module.scss";


const BlogPage = () => {

    const { isDarkModeActive } = useContext(DarkModeContext);
    const posts = useContext(BlogItemsContext);
    const postsViev = !posts.data ? "" : (
        posts.data.map((item) => (
            <PostItem key={ item._id } postItem={ item } homePage={ false } dataSource="cloud"/>
        )).reverse()
    );


    return (
        <div  className={ `${ !isDarkModeActive ? styles.blogWrapper : styles.blogWrapperDark }` }>

        <div className={styles.postsWrapper}>
        { !posts.data ? (
                <div className={ styles.spinner }>
                    <h4>Poczekaj na załadowanie elementów Blog-a...</h4>
                    <Spinner isOpen={ !posts.data ? false : true } />
                </div>
            ) : (
                postsViev
            ) }
        </div>

                <div className={styles.oldBlogWrapper}>
                <h1>Poprzednie lata</h1>
                <Link id="blog2024" to="/blog-2024" >
            Rok 2024
          </Link>
                <Link id="blog2023" to="/blog-2023" >
            Rok 2023
          </Link>
          </div>
        </div>
    );

};

export default BlogPage;