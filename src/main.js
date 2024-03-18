import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';

function initMap() {
    const map = new Map({
        target: 'map',
        layers: [
            new TileLayer({
                source: new OSM()
            })
        ],
        view: new View({
            center: fromLonLat([0, 0]),
            zoom: 2
        })
    });

    window.addEventListener('resize', () => {
        map.updateSize();
    });

    fetchData().then(data => {
        data.forEach(obj => {
            const marker = new Feature({
                geometry: new Point(fromLonLat(obj.coordinates))
            });

            const vectorSource = new VectorSource({
                features: [marker]
            });

            const markerVectorLayer = new VectorLayer({
                source: vectorSource
            });

            map.addLayer(markerVectorLayer);
        });
    });
}

function fetchData() {
    const cities = ['Washington', 'Tokyo', 'London', 'Moscow', 'Canberra', 'Krasnoyarsk'];
    const promises = cities.map(city =>
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
            .then(response => response.json())
            .then(data => ({
                name: city,
                coordinates: [parseFloat(data[0].lon), parseFloat(data[0].lat)]
            }))
    );
    return Promise.all(promises);
}

document.addEventListener('DOMContentLoaded', initMap);
