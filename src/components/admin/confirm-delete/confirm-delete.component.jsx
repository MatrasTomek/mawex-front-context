import AdminModal from "../admin-modal";
import Button from "../../button";

const ConfirmDelete = ({ post, busy, error, onConfirm, onCancel }) => (
	<AdminModal onClose={onCancel}>
		<div data-role="confirm" style={{ padding: "16px", textAlign: "center" }}>
			<p>Usunąć post „{post.title}”?</p>
			{error && <p style={{ color: "rgb(190, 20, 20)" }}>{error}</p>}
			<div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px" }}>
				<Button type="button" name="Anuluj" onClick={onCancel} />
				<Button type="button" name={busy ? "Usuwanie…" : "Usuń"} onClick={busy ? undefined : onConfirm} />
			</div>
		</div>
	</AdminModal>
);

export default ConfirmDelete;
