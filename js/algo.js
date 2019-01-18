$(document).ready(function () {
    //Kaufy**************************************************************************************
    /**
     * Map and layers Setup
     */
    var map;
    map = new ol.Map({
        view: new ol.View({
            center: [830000, 5800000],
            zoom: 10.2
        }),
        target: 'map'
    });

    var layerBingMapsRoad = new ol.layer.Tile({
        title: "Plan",
        source: new ol.source.BingMaps({
            key: 'AqE05oJsq-bWa50FPOW2S0eQm9Oqqygc1VTi_WPhUIoKR_-jgA559CRbfndgWAIz',
            imagerySet: 'Road'
        })
    });

    var layerBingMapsSat = new ol.layer.Tile({
        title: "Satelite",
        source: new ol.source.BingMaps({
            key: 'AqE05oJsq-bWa50FPOW2S0eQm9Oqqygc1VTi_WPhUIoKR_-jgA559CRbfndgWAIz',
            imagerySet: 'Aerial'
        })
    });

    map.addLayer(layerBingMapsSat);
    map.addLayer(layerBingMapsRoad);

    /**
     * View
     * @type {ol.View}
     */
    var v2 = new ol.View({projection: "EPSG:4326"});
    var cbox = [6.926040, 46.398030]; // Focus on Villeneuve
    v2.setCenter(cbox);
    v2.setZoom(10);
    map.setView(v2);
    var iconNormalStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: './images/placeholder.png',
            scale: 0.1
        }))
    });







































    //SEB**************************************************************************************
    /**
     * Get all the ski stations and draw them.
     * Retrieve GeoData from darksky API
     */
    setTimeout(async () => {
        var labelFeatures = [];

        let response2 = await $.getJSON(`https://sebibigbob8.carto.com/api/v2/sql/?q=select * from stations`);
        let keys = Object.values(response2.rows);
        for (const key of keys) {
            let urlWeather = `${darksky}/${key.lat},${key.long}?exclude=hourly,daily,flags&units=si`;
            let result = await doCORSRequest({url: urlWeather});
            labelFeatures.push(createMarker(result, key));
        }
        //label
        var vectorSource = new ol.source.Vector({
            features: labelFeatures //add an array of features
        });
        var labelLayer = new ol.layer.Vector({
            source: vectorSource,
        });
        map.addLayer(labelLayer);

        var selectInteraction = new ol.interaction.Select({
            condition: ol.events.condition.singleClick,
            // the interactive layers on which the selection is possible (they may be more than one)
            layers: [labelLayer]
        });
        map.addInteraction(selectInteraction);
        /**
         *  fire when one or more feature from the interactive layer(s) is(are) selected
         */
        let lastFeature = "";
        selectInteraction.on('select', function (e) {
            if (e.selected.length > 0) {
                if(lastFeature != "")
                    lastFeature.setStyle(iconNormalStyle);
                let feature = e.selected[0];
                console.log("feature",feature);
                $('#temperature').text(feature.values_.temperature);
                $('#visibility').text(feature.values_.visibility);
                $('#windSpeed').text(feature.values_.windSpeed);
                $('#precip').text(feature.values_.precipitation);
                $('#precipProbability').text(feature.values_.precipitationProbability);
                $('.spanInfo').show();
                var ext = feature.getGeometry().getExtent();
                var center = ol.extent.getCenter(ext);

                map.setView(new ol.View({
                    projection: 'EPSG:4326',
                    center: [center[0], center[1]],//zoom to the center of the feature
                    zoom: 12
                }));
                feature.setStyle(iconSelectStyle);
                lastFeature=feature;
            }
        });

    }, 1000);
    /**
     * LayerSwitcher
     */
    var layerSwitcher = new ol.control.LayerSwitcher();

    map.addControl(layerSwitcher);

    /**
     * Create a marker and save all WeatherDatas needed in properties
     * @param result
     * @param key
     * @returns {ol.Feature}
     */
    function createMarker(result, key) {
        let weatherData = result.currently
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point([key.long, key.lat]),
            name: key.name,
            temperature: weatherData.temperature,
            windSpeed: weatherData.windSpeed, // m/s
            visibility: weatherData.visibility, // KM
            precipitation: weatherData.precipIntensity,// mm/h
            precipitationProbability: weatherData.precipProbability // %
        });
        iconFeature.setStyle(iconNormalStyle);
        return iconFeature;
    }
    var iconSelectStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: './images/placeholder.png',
            scale: 0.2
        }))
    });
});


