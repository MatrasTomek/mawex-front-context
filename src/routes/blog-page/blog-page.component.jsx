import { useContext } from "react";
import { BlogItemsContext } from "../../contexts/blog-items.context";
import { PostItem } from "../../components";
import styles from "./blog-page.module.scss";

const BlogPage = () => {

    const posts = useContext(BlogItemsContext);
    const postsViev = !posts.data ? "" : (
        posts.data.map((item) => (
            <PostItem key={ item._id } postItem={ item } homePage={ false } />
        )).reverse()
    );

    return (
        <div className={ styles.blogWrapper }>
            { postsViev }
        </div>
    );

};

export default BlogPage;