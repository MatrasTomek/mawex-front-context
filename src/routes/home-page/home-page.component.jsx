import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { BannerSlider, Button, PostItem, MinPostItem } from "../../components";
import { firstSection, offerSection } from "../../content/homepage-content";
import { BlogItemsContext } from "../../contexts/blog-items.context";
import styles from "./home-page.module.scss";

const Home = () => {

    const { bigTitle, title1, title2, title3, content1, content2, content3 } = firstSection;

    const [isBox1Open, setIsBox1Open] = useState(false);
    const [isBox2Open, setIsBox2Open] = useState(false);
    const [isBox3Open, setIsBox3Open] = useState(false);

    const posts = useContext(BlogItemsContext);


    const [index, setIndex] = useState(0);
    const handleIndexChanger = (e) => {
        if (e.target.id === "home-next") {
            setIndex(index + 1);
        } else {
            setIndex(index - 1);
        }
    };


    const offerSectionItem = offerSection[index];

    const handleOpenBox = (e) => {
        let boxNumber = e.target.id;

        switch (boxNumber) {
            case "homeBox1":
                setIsBox1Open(!isBox1Open);
                break;
            case "homeBox2":
                setIsBox2Open(!isBox2Open);
                break;
            case "homeBox3":
                setIsBox3Open(!isBox3Open);
                break;
            default: return;
        };

    };

    const firstThreePosts = !posts.data ? ("") : (posts.data.slice(-3).reverse());
    const anotherThreePosts = !posts.data ? ("") : (posts.data.slice(-6, -3).reverse());



    const firstThreePostsViev = !posts.data ? (
        <div>
            <h4>Status: { posts.status }</h4>
            <h4>{ posts.message }</h4>
        </div>
    ) : (
        firstThreePosts.map((item) => (<PostItem key={ item._id } postItem={ item } homePage={ true } />))
    );

    const anotherThreePostsViev = !posts.data ? ("") : (
        anotherThreePosts.map((item) => (<MinPostItem key={ item._id } postItem={ item } />))
    );

    return (
        <>
            <BannerSlider />
            <div className={ styles.wrapper }>

                <h1>{ bigTitle }</h1>
                <div className={ styles.infoSection }>
                    <Link to="/">

                        <div className={ styles.opacity } style={ {
                            backgroundColor: `${ !isBox1Open ? "transparent" : "#000" }`,
                            opacity: `${ !isBox1Open ? 1 : 0.8 }`
                        } }>
                            <h3>{ title1 }</h3>
                            { isBox1Open ? (<p>{ content1 }</p>) : ("") }
                            <div className={ styles.buttons }>
                                <Button id="homeBox1" name={ `${ isBox1Open ? "zamknij" : "czytaj dalej" }` } type="button" onClick={ handleOpenBox } />
                            </div>
                        </div>
                    </Link>
                    <Link to="/">

                        <div style={ {
                            backgroundColor: `${ !isBox2Open ? "transparent" : "#000" }`,
                            opacity: `${ !isBox2Open ? 1 : 0.8 }`
                        } }>
                            <h3>{ title2 }</h3>
                            { isBox2Open ? (<p>{ content2 }</p>) : ("") }
                            <div className={ styles.buttons }>
                                <Button id="homeBox2" name={ `${ isBox2Open ? "zamknij" : "czytaj dalej" }` } type="button" onClick={ handleOpenBox } />
                            </div>
                        </div>
                    </Link>
                    <Link to="/">

                        <div style={ {
                            backgroundColor: `${ !isBox3Open ? "transparent" : "#000" }`,
                            opacity: `${ !isBox3Open ? 1 : 0.8 }`

                        } }>

                            <h3>{ title3 }</h3>
                            { isBox3Open ? (<p>{ content3 }</p>) : ("") }
                            <div className={ styles.buttons }>
                                <Button id="homeBox3" name={ `${ isBox3Open ? "zamknij" : "czytaj dalej" }` } type="button" onClick={ handleOpenBox } />
                            </div>
                        </div>
                    </Link>
                </div>
                <div className={ styles.offerSection }>
                    <h3>Nasza oferta</h3>
                    <div className={ styles.carusel }>
                        <div className={ styles.imageOffer }>
                            <h4 >{ offerSectionItem.title }</h4>
                        </div>
                        <div className={ styles.offerItem } key={ offerSectionItem.id }>
                            <div className={ styles.buttons }>
                                { index <= 0 ? (<p></p>) : (<Button name="poprzedni" type="button" id="home-prev" onClick={ handleIndexChanger } />) }
                                { index >= 9 ? (<p></p>) : (<Button name="następny" type="button" id="home-next" onClick={ handleIndexChanger } />) }
                            </div>
                            <Link to={ `${ offerSectionItem.linkPath }` }>
                                <p  >{ offerSectionItem.content }</p>
                                <p>zobacz { ">>>" }</p>
                            </Link>
                        </div>
                    </div>
                    <div className={ styles.postsSection }>
                        <h3>Najnowsze wiadomości</h3>
                        <div className={ styles.postItems }>
                            { firstThreePostsViev }
                        </div>
                        <div className={ styles.minPostItems }>
                            { anotherThreePostsViev }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;