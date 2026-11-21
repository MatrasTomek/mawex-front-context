import { useEffect, useRef } from "react";
import Modal from "../../modal";

const FOCUSABLE = 'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

// Modal panelu: z ramką, fokus wchodzi do środka i wraca na element, z którego otwarto,
// Escape zamyka, Tab krąży wewnątrz okna.
const AdminModal = ({ children, onClose }) => {
	const dialogRef = useRef(null);
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	useEffect(() => {
		const opener = document.activeElement;
		const dialog = dialogRef.current;
		const first = dialog.querySelector(FOCUSABLE);
		(first || dialog).focus();
		return () => {
			if (opener && opener.isConnected && typeof opener.focus === "function") opener.focus();
		};
	}, []);

	const handleKeyDown = (event) => {
		if (event.key === "Escape") {
			event.stopPropagation();
			onCloseRef.current();
			return;
		}
		if (event.key !== "Tab") return;
		const items = [...dialogRef.current.querySelectorAll(FOCUSABLE)];
		if (items.length === 0) return;
		const firstItem = items[0];
		const lastItem = items[items.length - 1];
		if (event.shiftKey && document.activeElement === firstItem) {
			event.preventDefault();
			lastItem.focus();
		} else if (!event.shiftKey && document.activeElement === lastItem) {
			event.preventDefault();
			firstItem.focus();
		}
	};

	return (
		<Modal isModalOpen handleOnCloseModal={onClose} bordered>
			<div ref={dialogRef} role="dialog" aria-modal="true" tabIndex={-1} onKeyDown={handleKeyDown} style={{ outline: "none" }}>
				{children}
			</div>
		</Modal>
	);
};

export default AdminModal;
