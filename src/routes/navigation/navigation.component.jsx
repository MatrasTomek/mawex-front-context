import { Fragment } from 'react';
import { Outlet, Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <Fragment>
            <div>
                <div>
                    <img src="" alt="logo" />
                </div>
                <div>
                    <Link to="/">Home</Link>
                    <Link to="/">Oferta</Link>
                    <Link to="/">Certyfikaty</Link>
                    <Link to="/">Korzyści</Link>
                    <Link to="/">Prawo</Link>
                    <Link to="/">Blog</Link>
                    <Link to="/">Kontakt</Link>
                    <Link to="/">Wypożyczalnia</Link>
                </div>
            </div>
            <Outlet />
        </Fragment>
    );
};

export default Navigation;