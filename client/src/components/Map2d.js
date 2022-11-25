import React, { useEffect } from 'react'
import ReactDOM from "react-dom/client"
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl"
import NavigationIcon from '@mui/icons-material/Navigation';

function Map2d({socket}) {
    async function init() {
        //request gps messages
        socket.emit("request_message_stream", ["GLOBAL_POSITION_INT"])

        mapboxgl.accessToken = 'pk.eyJ1IjoicGV4ZXVzIiwiYSI6ImNsMGVrYnJ5dTBqcmYza216cXhib3k1ajEifQ.AVLmYS9GH1eFUlSMGvPQkg';

        const map = new mapboxgl.Map({
            container: 'map2d', // container ID
            style: 'mapbox://styles/mapbox/satellite-v9', // style URL
            center: [0, 0], // starting position [lng, lat]
            zoom: 1, // starting zoom
            projection: 'globe' // display the map as a 3D globe
        });

        map.on('style.load', () => {
            map.setFog({}); // Set the default atmosphere style
        });

        function resizer() {
            map.resize()
        }

        //resize observer
        new ResizeObserver(resizer).observe(document.querySelector("#map2d"))

        //plane marker
        const marker = document.createElement("div")
        marker.id = "pos"

        const root = ReactDOM.createRoot(marker)
        root.render(<NavigationIcon color='primary' fontSize='large'/>)

        const plane = new mapboxgl.Marker(marker).setLngLat([0, 0]).addTo(map);

        socket.on("GLOBAL_POSITION_INT", p => {
            map.setBearing(p.hdg / 100)
            map.setPitch(60)

            map.flyTo({
                center: [p.lon / 10000000, p.lat / 10000000],
                zoom: 13,
                animate: true
            })

            //plane marker
            plane.setLngLat([p.lon / 10000000, p.lat / 10000000])
        })
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div className='map' id='map2d'>

        </div>
    )
}

export default Map2d