import React, { useEffect } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl"

function Map2d() {
    async function init() {
        mapboxgl.accessToken = 'pk.eyJ1IjoicGV4ZXVzIiwiYSI6ImNsMGVrYnJ5dTBqcmYza216cXhib3k1ajEifQ.AVLmYS9GH1eFUlSMGvPQkg';

        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v11', // style URL
            center: [-74.5, 40], // starting position [lng, lat]
            zoom: 9, // starting zoom
            projection: 'globe' // display the map as a 3D globe
        });

        map.on('style.load', () => {
            console.log("laod");
            map.setFog({}); // Set the default atmosphere style
        });
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div>
            <div className='floaterMap' id='map'>

            </div>
        </div>
    )
}

export default Map2d