import Button from "../../button";
import styles from "./post-list.module.scss";

const PostList = ({ posts, onEdit, onDelete }) => (
	<ul className={styles.list}>
		{posts.map((post) => (
			<li key={post._id} className={styles.item}>
				{post.imgPath ? <img src={`/${post.imgPath}`} alt="" className={styles.thumb} /> : <div className={styles.thumb} />}
				<div className={styles.info}>
					<h3>{post.title}</h3>
					<p>
						{post.date} · {post.userName}
					</p>
				</div>
				<div className={styles.actions}>
					<Button type="button" name="Edytuj" onClick={() => onEdit(post)} />
					<Button type="button" name="Usuń" onClick={() => onDelete(post)} />
				</div>
			</li>
		))}
	</ul>
);

export default PostList;
