import { Button } from "..";
import Modal from "../../components/modal/modal.component";
import styles from "./item-viev.module.scss";

const ItemViev = ({ isModalOpen, setModalOpen, pictureName, }) => {
    console.log(pictureName);
    // const bigPicturePath = `images/${ catalogName }/${ pictureNo }${ pictureEnd }.jpg`;

    const handleOnClose = () => {
        setModalOpen(false);
    };

    return (
        <Modal isModalOpen={ isModalOpen }>
            <div
                className={ styles.image }
                style={ {
                    backgroundImage: `url(${ pictureName })`,
                } }
            >

                <div className={ styles.buttons }>

                    <Button name="zamknij" onClick={ handleOnClose } />
                </div>
            </div>
        </Modal>
    );
};

export default ItemViev;