import { useEffect, useState } from "react";

import styles from "./bannerSlider.module.scss";

const BannerSlider = () => {
	const BANNER_SLIDER = [
		{
			id: 0,
			content: "Odkrywamy talenty dzieci",
			imgPathSmall: "images/banner/drawing-428383_640.jpg",
			imgPathBig: "images/banner/drawing-428383_1920.jpg",
		},
		{
			id: 1,
			content: "Uczymy się przez zabawę",
			imgPathSmall: "images/banner/soap-bubble-2403673_640.jpg",
			imgPathBig: "images/banner/soap-bubble-2403673_1920.jpg",
		},
		{
			id: 2,
			content: "Codziennie bawimy się na świeżym powietrzu",
			imgPathSmall: "images/banner/playground-2560993_640.jpg",
			imgPathBig: "images/banner/playground-2560993_1920.jpg",
		},
		{
			id: 3,
			content: "Smacznie jemy z własnej kuchni",
			imgPathSmall: "images/banner/girl-846357_640.jpg",
			imgPathBig: "images/banner/girl-846357_1920.jpg",
		},
	];
	const [picIndex, setPicIndex] = useState(0);

	let indexNo = picIndex;
	const changeIndex = () => {
		indexNo++;
		if (indexNo >= BANNER_SLIDER.length) {
			indexNo = 0;
		}
		setPicIndex(indexNo);
	};
	useEffect(() => {
		const interval = setInterval(() => {
			changeIndex();
		}, 7000);

		return () => {
			clearInterval(interval);
		};
	});

	const slider = BANNER_SLIDER.map((item) => (
		<div key={item.id} className={styles.image} style={{ backgroundImage: `url(${item.imgPathBig})`, left: "0%" }}>
			<div className={styles.content} style={{}}>
				<p>{item.content} </p>
			</div>
		</div>
	)).reverse();

	const slideShow = () => {
		slider[picIndex].props.style.opacity = "1";
		// slider[picIndex === BANNER_SLIDER.length ? 0 : picIndex].props.style.opacity = "0";
		slider[picIndex].props.children.props.style.opacity = "1";
		// slider[picIndex === BANNER_SLIDER.length ? 0 : picIndex].props.children.props.style.opacity = "1";
		slider[picIndex].props.children.props.style.top = "40%";
		// slider[picIndex === BANNER_SLIDER.length ? 0 : picIndex].props.children.props.style.top = "40%";
	};
	slideShow();

	const handleChangeSlide = (e) => {
		setPicIndex(e.target.id);
	};

	const dots = BANNER_SLIDER.map((item) => (
		<div key={item.id} id={item.id} className={styles.dot} style={{}} onClick={handleChangeSlide}></div>
	));

	const activeDot = () => {
		dots[picIndex].props.style.backgroundColor = "rgb(180, 180, 180)";
		dots[picIndex].props.style.border = "2px solid rgb(23, 23, 184)";
	};
	activeDot();

	return (
		<div className={styles.wrapper}>
			{slider}
			<div className={styles.dots}>{dots}</div>
		</div>
	);
};

export default BannerSlider;
