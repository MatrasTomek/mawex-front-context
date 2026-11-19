import { useCallback, useContext, useEffect, useState } from "react";
import { AdminSessionProvider, useAdminSession, SESSION_EXPIRED } from "../../contexts/admin-session.context";
import { DarkModeContext } from "../../contexts/dark-mode.context";
import { getPosts, deletePost } from "../../utils/admin.utils";
import Button from "../../components/button";
import Spinner from "../../components/spinner";
import LoginForm from "../../components/admin/login-form";
import PostList from "../../components/admin/post-list";
import ConfirmDelete from "../../components/admin/confirm-delete";
import PostForm from "../../components/admin/post-form";
import styles from "./admin-page.module.scss";

const Dashboard = () => {
	const { token, user, logout } = useAdminSession();
	const [posts, setPosts] = useState({ loading: true, error: null, items: [] });
	const [toDelete, setToDelete] = useState(null);
	const [deleteState, setDeleteState] = useState({ busy: false, error: null });
	const [editing, setEditing] = useState(null); // null | "new" | post

	const expire = useCallback(() => logout(SESSION_EXPIRED), [logout]);

	const load = useCallback(async () => {
		setPosts((p) => ({ ...p, loading: true, error: null }));
		const res = await getPosts();
		if (res.ok) setPosts({ loading: false, error: null, items: [...res.data].reverse() });
		else setPosts({ loading: false, error: res.message, items: [] });
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	const confirmDelete = async () => {
		setDeleteState({ busy: true, error: null });
		const res = await deletePost(token, toDelete._id);
		if (res.unauthorized) return expire();
		if (!res.ok) return setDeleteState({ busy: false, error: res.message });
		setPosts((p) => ({ ...p, items: p.items.filter((item) => item._id !== toDelete._id) }));
		setToDelete(null);
		setDeleteState({ busy: false, error: null });
	};

	const handleSaved = (saved) => {
		setPosts((p) => ({
			...p,
			items: p.items.some((item) => item._id === saved._id)
				? p.items.map((item) => (item._id === saved._id ? saved : item))
				: [saved, ...p.items],
		}));
		setEditing(null);
	};

	return (
		<>
			<header className={styles.header}>
				<h1>Panel Mawex — blog</h1>
				<div className={styles.userBox}>
					<span data-role="user">{user.name}</span>
					<Button type="button" name="Wyloguj" onClick={() => logout()} />
				</div>
			</header>
			<main className={styles.main}>
				<Button type="button" name="+ Dodaj post" onClick={() => setEditing("new")} />
				{posts.loading && <Spinner />}
				{posts.error && (
					<div className={styles.error}>
						<p>{posts.error}</p>
						<Button type="button" name="Spróbuj ponownie" onClick={load} />
					</div>
				)}
				{!posts.loading && !posts.error && (
					<PostList posts={posts.items} onEdit={setEditing} onDelete={(post) => setToDelete(post)} />
				)}
			</main>
			{editing && (
				<PostForm
					post={editing === "new" ? null : editing}
					token={token}
					defaultUserName={user.name}
					onSaved={handleSaved}
					onCancel={() => setEditing(null)}
					onUnauthorized={expire}
				/>
			)}
			{toDelete && (
				<ConfirmDelete
					post={toDelete}
					busy={deleteState.busy}
					error={deleteState.error}
					onConfirm={confirmDelete}
					onCancel={() => {
						setToDelete(null);
						setDeleteState({ busy: false, error: null });
					}}
				/>
			)}
		</>
	);
};

const AdminScreen = () => {
	const { status, notice, login } = useAdminSession();
	const { isDarkModeActive } = useContext(DarkModeContext);

	return (
		<div className={isDarkModeActive ? styles.wrapperDark : styles.wrapper}>
			{status === "checking" && (
				<div className={styles.center}>
					<Spinner />
				</div>
			)}
			{status === "anonymous" && <LoginForm onLogin={login} notice={notice} />}
			{status === "authenticated" && <Dashboard />}
		</div>
	);
};

const AdminPage = () => (
	<AdminSessionProvider>
		<AdminScreen />
	</AdminSessionProvider>
);

export default AdminPage;
