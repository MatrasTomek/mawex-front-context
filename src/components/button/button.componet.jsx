

const Button = ({ name, id, onClick, type }) => {

    return (
        <button id={ id } onClick={ onClick } type={ type }>{ name }</button>
    );
};

export default Button;