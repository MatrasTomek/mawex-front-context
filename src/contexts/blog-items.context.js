import { createContext, useState, useEffect } from "react";
import { getAllPosts } from "../utils/posts.utils";
export const BlogItemsContext = createContext({
	posts: {},
});

export const PostsProvider = ({ children }) => {
	const [posts, setPosts] = useState({});

	useEffect(() => {
		const getPosts = async () => {
			const allPosts = await getAllPosts();
			setPosts(allPosts);
		};
		getPosts();
	}, []);

	const value = posts;
	return <BlogItemsContext.Provider value={value}>{children}</BlogItemsContext.Provider>;
};
