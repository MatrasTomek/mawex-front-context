import { useContext, useState, useEffect } from "react";
import { PostItem, Spinner } from "../../components";
import { DarkModeContext } from "../../contexts/dark-mode.context";
import jsonBlog2023 from "../../content/posts-2023.json";
import styles from "./blog2023-page.module.scss";


const Blog2023Page = () => {

    const { isDarkModeActive } = useContext(DarkModeContext);
    const [posts, setPosts] = useState(false);

    useEffect(() => {
    setPosts(jsonBlog2023)
      }, []);

      const postsView = !posts ? "" : (
        posts.data.map((item) => (
          <PostItem key={item._id} postItem={item} homePage={false} />
        )).reverse()
      );

    return (
        <div  className={ `${ !isDarkModeActive ? styles.blogWrapper : styles.blogWrapperDark }` }>
            <h2>Wiadomości w 2023 roku</h2>
            { !postsView ? (
                <div className={ styles.spinner }>
                    <h4>Poczekaj na załadowanie elementów Blog-a...</h4>
                    <Spinner isOpen={ !posts.data ? false : true } />
                </div>
            ) : (
                postsView
            ) }
        </div>
    );

};

export default Blog2023Page;