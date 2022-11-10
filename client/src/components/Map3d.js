import React, { useEffect } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from "mapbox-gl"
import {config} from "../config"

function Map3d({socket}) {
    let startPos
    let map
    const pi = Math.PI

    async function setupMap() {
        mapboxgl.accessToken = 'pk.eyJ1IjoicGV4ZXVzIiwiYSI6ImNsMGVrYnJ5dTBqcmYza216cXhib3k1ajEifQ.AVLmYS9GH1eFUlSMGvPQkg';
        startPos = await getGroundPos()
        const mapContainer = document.querySelector("#map")

        //DIRTY ASS FIX
        setInterval(() => {
            socket.emit("set_message_interval", [24, 30])
        }, 2000);

        //create map
        map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/satellite-v9',
            center: [startPos[0], startPos[1]],
            zoom: 15,
            pitch: 80,
            bearing: 0
        });

        //resize on mouseleave/enter
        mapContainer.addEventListener("mouseenter", () => {
            setTimeout(() => {
                map.resize()
            }, 300);
        })

        mapContainer.addEventListener("mouseleave", () => {
            setTimeout(() => {
                map.resize()
            }, 300);
        })

        //add fulscreen control
        map.addControl(new mapboxgl.FullscreenControl({ container: document.querySelector('map') }));

        //on map ready
        map.on("load", () => {
            map.addSource('mapbox-dem', {
                'type': 'raster-dem',
                'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
                'tileSize': 512,
                'maxzoom': 18
            });

            // add the DEM source as a terrain layer with exaggerated height
           

            // add a sky layer that will show when the map is highly pitched
            map.addLayer({
                'id': 'sky',
                'type': 'sky',
                'paint': {
                    'sky-type': 'atmosphere',
                    'sky-atmosphere-sun': [0.0, 0.0],
                    'sky-atmosphere-sun-intensity': 15
                }
            });

            //start updating the camera
            updateCamera()
        })
    }


    function updateCamera() {
        const camera = map.getFreeCameraOptions();

        function update() {
            const mapElement = document.querySelector("#map")
            camera.setPitchBearing(90 + pos.pitch, pos.yaw)
            camera.position = mapboxgl.MercatorCoordinate.fromLngLat([pos.lon, pos.lat], 200);

            console.log(90 + pos.pitch);

            map.setFreeCameraOptions(camera);
            mapElement.style.transform = `rotate(${-pos.roll}deg)`
            map.transform._fov = 1;
        }

        const pos = {
            lat: startPos[1],
            lon: startPos[0],
            alt: 0,
            yaw: 0,
            pitch: 0,
            roll: 0,
        }
        
        socket.on("GLOBAL_POSITION_INT", packet => {
            //check if GPS coordinates are invalid (0 == no GPS)
            if (packet.lat != 0 && packet.lon != 0) {
                //update lat/lon
                pos.lat = (packet.lat / 10000000)
                pos.lon = (packet.lon / 10000000)
            }

            //update height
            const elevation = map.queryTerrainElevation([pos.lon, pos.lat])
            const relativeElevation = (packet.alt / 1000) - elevation

            pos.alt = (packet.alt / 1000)
            pos.relAlt = relativeElevation
            update()
        })
        
        socket.on("ATTITUDE", packet => {
            pos.yaw = deg(packet.yaw)
            pos.pitch = deg(packet.pitch)
            pos.roll = deg(packet.roll)
            update()
        })
    }


    //get the position of the ground station
    function getGroundPos() {
        return new Promise(res => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(returnPos);
            }
            else {
                returnPos(false);
            }
            function returnPos(pos) {
                if (!pos) {
                    res([0, 0])
                }
                else {
                    res([pos.coords.longitude, pos.coords.latitude])
                }
            }
        })
    }

    function deg(rad) {
        return rad * (180 / pi);
    }

    useEffect((() => {setupMap()}), [socket])

    return (
        <div id='map'></div>
    )
}

export default Map3d