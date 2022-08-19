import React from 'react';
import GoogleMap from 'google-map-react';
import Marker from './Marker';
import './OurLocations.css';
import { OurLocationsJson } from '../../MockData/OurLocations';
import { GOOGLE_API_KEY } from '../../Utils/serviceURLConfig';

function OurLocations() {
    return (
        <div className="mapContainer">
            <GoogleMap
                scrollEnabled={true}
                bootstrapURLKeys={{ key: [GOOGLE_API_KEY] }}
                center={{ lat: 51.506, lng: -0.169 }}
                zoom={12}
            >
                {OurLocationsJson.map((obj, k) => (
                    <Marker key={k} lat={obj.lat} lng={obj.lng} text={obj.id} obj={obj}
                    />
                )
                )}
            </GoogleMap>
        </div>
    );
}

export default OurLocations;
