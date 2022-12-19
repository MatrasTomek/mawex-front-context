import React from "react";
import { Marker } from "@react-google-maps/api";

// const MapMarker = React.forwardRef((props, ref) => {

const MapMarker = ({ setZoom }) => {
	const handleOnClickMarker = () => {
		setZoom(10);
	};

	const position = { lat: 49.97386, lng: 20.62926 };

	// Note below
	return (
		<Marker
			position={position}
			// title={title}
			// ref={ref}
			onClick={handleOnClickMarker}
			icon={
				{
					// url: "/icons/map-icon-green.svg",
					// anchor: new window.google.maps.Point(32, 32),
					// scaledSize: new window.google.maps.Size(62, 79),
				}
			}
		/>
	);
};

export default React.memo(MapMarker);

// Note if you are using class base component then you can forwardRef like
// export default React.forwardRef((props, ref) => <MapMarker innerRef={ref} {...props} />);
