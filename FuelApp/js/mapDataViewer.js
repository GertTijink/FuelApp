$(document).ready(function () {
    proj4.defs("EPSG:28992", "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs");

    addSources();
    addBaseLayers();
    setupMap();
    setGeoPosition();
    addButtonControllers();
});

/// Globale basemaps variabelen
var osmLaag;
var satelliteBingLaag;

/// OpenLayers variabele
var map;

/// Variabelen voor het bepalen van begin- en eindpunt
var startPositionRoute; // behoudt 'EPSG:4326' coordinaten
var endPositionRoute; // behoudt 'EPSG:4326' coordinaten

/// Variabelen voor het genereren van een route
var mijnFetchData;
var version = 'v5';
var language = getBestMatchingLanguage('nl');
var points = [],
    msg_el = document.getElementById('msg'),
    url_osrm_nearest = '//router.project-osrm.org/nearest/v1/driving/', /// API voor bepalen van dichtsbijzijnde weg om te bepalen waar de route moet beginnen
    url_osrm_route = '//router.project-osrm.org/route/v1/driving/', /// API voor ophalen van de route
    marker = 'img/icon.png',
    vectorSource = new ol.source.Vector(),
    vectorLayer = new ol.layer.Vector({
        source: vectorSource
    }),
    styles = {
        route: new ol.style.Style({
            stroke: new ol.style.Stroke({
                width: 6,
                color: [0, 171, 252, 0.8]
            })
        }),
        icon: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 1],
                src: marker,
                scale: 0.15,
            })
        })
    };

/// Onderdeel van de route aanmaken
var utils = {
    getNearest: function (pos) {
        var coord4326 = utils.to4326(pos);
        return new Promise(function (resolve, reject) {
            //make sure the coord is on street
            fetch(url_osrm_nearest + coord4326.join()).then(function (response) {
                // Convert to JSON
                return response.json();
            }).then(function (json) {
                if (json.code === 'Ok') resolve(json.waypoints[0].location);
                else reject();
            });
        });
    },
    createFeature: function (coord) {
        var feature = new ol.Feature({
            type: 'place',
            geometry: new ol.geom.Point(ol.proj.fromLonLat(coord))
        });
        feature.setStyle(styles.icon);
        vectorSource.addFeature(feature);
    },
    createRoute: function (polyline) {
        var route = new ol.format.Polyline({
            factor: 1e5
        }).readGeometry(polyline, {
            dataProjection: 'EPSG:4326',
            featureProjection: 'EPSG:3857'
        });
        var feature = new ol.Feature({
            type: 'route',
            geometry: route
        });
        feature.setStyle(styles.route);
        vectorSource.addFeature(feature);
    },
    to4326: function (coord) {
        return ol.proj.transform([parseFloat(coord[0]), parseFloat(coord[1])], 'EPSG:3857', 'EPSG:4326');
    }
};

/// Inladen van de sources (tankstations)
function addSources() {
    AWegSource = new ol.source.ImageWMS({
        url: 'http://localhost:8080/geoserver/Engi/wms',
        params: {
            'LAYERS': 'Engi:afstand_tot_ts_a_weg'
        },
        serverType: 'geoserver'
    });

    BWegSource = new ol.source.ImageWMS({
        url: 'http://localhost:8080/geoserver/Engi/wms',
        params: {
            'LAYERS': 'Engi:afstand_tot_ts_b_weg'
        },
        serverType: 'geoserver'
    });
}

/// Toevoegen van kaartlagen
function addBaseLayers() {

    osmLaag = new ol.layer.Tile({
        title: 'Open Streetmap',
        type: 'base',
        source: new ol.source.OSM()
    });

    satelliteBingLaag = new ol.layer.Tile({
        visible: false,
        preload: Infinity,
        source: new ol.source.BingMaps({
            key: 'AqbMZ_VTz0MogQepG-LOWDvhEDJN8FiLKmlKtQPosnJIhffVr59O9Q_20XyDvWcW',
            imagerySet: 'Aerial'
        })
    });
}

/// Kaart functionaliteiten
function setupMap() {

    /// Kaart aanmaken op de pagina 
    map = new ol.Map({
        target: 'map',
        layers: [osmLaag, satelliteBingLaag, vectorLayer],
        view: new ol.View({
            zoom: 14
        })
    });
}

/// Bepalen van GPS locatie en bij geladen pagina naar deze locatie centreren
function setGeoPosition() {
    geolocation = new ol.Geolocation({
        projection: map.getView().getProjection()
    });
    geolocation.setTracking(true);

    geolocation.on('change:position', function () {
        setStartPointRoute(geolocation.getPosition());
        map.getView().setCenter(geolocation.getPosition());
    });
}

/// Functie voor het bepalen van het startpunt van de route
function setStartPointRoute(pos) {
    utils.getNearest(pos).then(function (startPos) {

        var last_point = points[points.length - 1];
        var points_length = points.push(startPos);

        utils.createFeature(startPos);
        startPositionRoute = startPos;
    });
}

/// Functie waar de OSRM API wordt benaderd om de route te bepalen
function createRoute() {
    fetch(url_osrm_route + startPositionRoute + ';' + endPositionRoute + '?steps=true').then(function (r) {
        return r.json();

    }).then(function (json) {
        if (json.code !== 'Ok') {
            msg_el.innerHTML = 'Geen route gevonden.';
            return;
        }
        msg_el.innerHTML = 'Uw route staat klaar.';
        mijnFetchData = json.routes[0].legs;
        mijnFetchData.forEach(function (leg) {
            mijnFetchData[0].steps.forEach(function (step) {
                var instruction = compile(language, step)

                var c = document.getElementById("instr").innerHTML;
                document.getElementById("instr").innerHTML = c + instruction + "</br>";
            });
        });
        utils.createRoute(json.routes[0].geometry);
    });
}

/// AJAX Call om tankstation locatie op te halen.
function setEndPosition(webURL) {
    $.ajax({
        url: 'php/geoproxycurl.php',
        method: 'POST',
        data: {
            url: webURL
        },
        dataType: 'json'
    }).done(function (data) {
        var geometry = data.features[0].properties.geometry;
        var fields = geometry.split(" ");
        var posX = parseFloat(fields[0].slice(11));
        var posY = parseFloat(fields[1].slice(0, -1));

        endPositionRoute = [posX, posY];           
        utils.createFeature(endPositionRoute);
        createRoute();
    });
}

/// Functionaliteit om de route te berekenen wordt hier aan de knoppen op de hoofdpagina gekoppeld
function addButtonControllers() {
    var nearestGas;

    $(".A-wegKnop").click(function () {
        nearestGas = ol.proj.fromLonLat(startPositionRoute, 'EPSG:28992');

        setEndPosition('http://localhost:8080/geoserver/Engi/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Engi:afstand_tot_ts_a_weg&maxFeatures=50&outputFormat=application%2Fjson' + '&viewparams=x:' + nearestGas[0].toString().split(".")[0] + ';y:' + nearestGas[1].toString().split(".")[0]);
    });

    $(".B-wegKnop").click(function () {
        nearestGas = ol.proj.fromLonLat(startPositionRoute, 'EPSG:28992');
        setEndPosition('http://localhost:8080/geoserver/Engi/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Engi:afstand_tot_ts_b_weg&maxFeatures=50&outputFormat=application%2Fjson' + '&viewparams=x:' + nearestGas[0].toString().split(".")[0] + ';y:' + nearestGas[1].toString().split(".")[0]);
    });
}

/// Switchen tussen basemaps
function switchBaseMap(basemap) {

    switch (basemap) {
        case 'osm':
            satelliteBingLaag.setVisible(false);
            osmLaag.setVisible(true);
            break;
        case 'bing':
            satelliteBingLaag.setVisible(true);
            osmLaag.setVisible(false);
            break;
    }

}
