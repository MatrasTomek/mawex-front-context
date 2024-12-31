import { useContext, useState, useEffect } from "react";
import { PostItem, Spinner } from "../../components";
import { DarkModeContext } from "../../contexts/dark-mode.context";
import jsonBlog2024 from "../../content/posts-2024.json";
import styles from "./blog2024-page.module.scss";


const Blog2024Page = () => {

    const { isDarkModeActive } = useContext(DarkModeContext);
    const [posts, setPosts] = useState(false);

    useEffect(() => {
    setPosts(jsonBlog2024)
      }, []);

      const postsView = !posts ? "" : (
        posts.data.map((item) => (
          <PostItem key={item._id} postItem={item} homePage={false} dataSource="blog2024"/>
        )).reverse()
      );

    return (
        <div  className={ `${ !isDarkModeActive ? styles.blogWrapper : styles.blogWrapperDark }` }>
            <h2>Wiadomości w 2023 roku</h2>
          <div className={styles.postsWrapper}>
          { !postsView ? (
                <div className={ styles.spinner }>
                    <h4>Poczekaj na załadowanie elementów Blog-a...</h4>
                    <Spinner isOpen={ !posts.data ? false : true } />
                </div>
            ) : (
                postsView
            ) }
          </div>
        </div>
    );

};

export default Blog2024Page;