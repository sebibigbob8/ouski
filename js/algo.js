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

    var layerOSM = new ol.layer.Image({
        title: "Avalanche",
        opacity: 0.5,
        source: new ol.source.ImageWMS({
            url: chWMS,
            params: {
                VERSION: "1.0.0",
                LAYERS: "ch.bafu.showme-gemeinden_lawinen",
                FORMAT: "image/png"
            },
        })
    });

    var layerBingMapsSat = new ol.layer.Tile({
        title: "Satelite",
        source: new ol.source.BingMaps({
            key: 'AqE05oJsq-bWa50FPOW2S0eQm9Oqqygc1VTi_WPhUIoKR_-jgA559CRbfndgWAIz',
            imagerySet: 'Aerial'
        })
    });

    var layerBingMapsRoad = new ol.layer.Tile({
        title: "Plan",
        source: new ol.source.BingMaps({
            key: 'AqE05oJsq-bWa50FPOW2S0eQm9Oqqygc1VTi_WPhUIoKR_-jgA559CRbfndgWAIz',
            imagerySet: 'Road'
        })
    });

    map.addLayer(layerBingMapsRoad);
    map.addLayer(layerBingMapsSat);
    map.addLayer(layerOSM);
    
    /**
     * View
     * @type {ol.View}
     */
    var v2 = new ol.View({ projection: "EPSG:4326" });
    var cbox = [7.396220, 46.295610]; // Focus on Veysonnaz
    v2.setCenter(cbox);
    v2.setZoom(10);
    map.setView(v2);
    //SEB**************************************************************************************
    /**
     * Get all the ski stations and draw them.
     * Retrieve GeoData from darksky API
     */
    setTimeout(async () => {
        var labelFeatures = [];
        //let response2 = await $.getJSON(`https://sebibigbob8.carto.com/api/v2/sql/?q=select * from stations where name="Zermatt"`);
        let response2 = await $.getJSON(`https://sebibigbob8.carto.com/api/v2/sql/?q=select * from stations`);
        let keys = Object.values(response2.rows);
        let test;
        //Pour chaque station, créer un markeur
        for (const key of keys) {
            let urlWeather = `${darksky}/${key.lat},${key.long}?exclude=flags&units=si`;
            let result = await doCORSRequest({ url: urlWeather });
            test = result;
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
                if (lastFeature != "")
                    lastFeature.setStyle(iconNormalStyle);
                let feature = e.selected[0];
                $('#station').text(feature.values_.name);
                //Currently
                $('#temperature').text(Math.round(feature.values_.temperature));
                $('#visibility').text(Math.round(feature.values_.visibility) + "km");
                $('#windSpeed').text(Math.round(feature.values_.windSpeed) + "m/s");
                $('#precip').text(Math.round(feature.values_.precipitation) + "mm/h");
                $('#precipProbability').text(feature.values_.precipitationProbability*100 + "%");
                $('#summary').text(feature.values_.summary);
                $('#icon').attr('src', feature.values_.icon);
                //Today
                $('#temperatureToday').text(Math.round(feature.values_.temperatureToday));
                $('#visibilityToday').text(Math.round(feature.values_.visibilityToday) + "km");
                $('#windSpeedToday').text(Math.round(feature.values_.windSpeedToday) + "m/s");
                $('#precipToday').text(Math.round(feature.values_.precipitationToday) + "mm/h");
                $('#precipProbabilityToday').text(feature.values_.precipitationProbabilityToday*100 + "%");
                $('#summaryToday').text(feature.values_.summaryToday);
                $('#iconToday').attr('src', feature.values_.iconToday);
                //nextday
                $('#temperatureNext1').text(Math.round(feature.values_.temperatureNext1));
                $('#visibilityNext1').text(Math.round(feature.values_.visibilityNext1) + "km");
                $('#windSpeedNext1').text(Math.round(feature.values_.windSpeedNext1) + "m/s");
                $('#precipNext1').text(Math.round(feature.values_.precipitationNext1) + "mm/h");
                $('#precipProbabilityNext1').text(feature.values_.precipitationProbabilityNext1*100 + "%");
                $('#summaryNext1').text(feature.values_.summaryNext1);
                $('#iconNext1').attr('src', feature.values_.iconNext1);
                //nextday2
                $('#temperatureNext2').text(Math.round(feature.values_.temperatureNext2));
                $('#visibilityNext2').text(Math.round(feature.values_.visibilityNext2) + "km");
                $('#windSpeedNext2').text(Math.round(feature.values_.windSpeedNext2) + "m/s");
                $('#precipNext2').text(Math.round(feature.values_.precipitationNext2) + "mm/h");
                $('#precipProbabilityNext2').text(feature.values_.precipitationProbabilityNext2*100 + "%");
                $('#summaryNext2').text(feature.values_.summaryNext2);
                $('#iconNext2').attr('src', feature.values_.iconNext2);
                //Week
                $('#summaryWeek').text(feature.values_.summaryWeek);
                $('.divInfo').hide();
                $('#informations').show();
                var ext = feature.getGeometry().getExtent();
                var center = ol.extent.getCenter(ext);

                map.setView(new ol.View({
                    projection: 'EPSG:4326',
                    center: [center[0], center[1]],//zoom to the center of the feature
                    zoom: 12
                }));
                feature.setStyle(iconSelectStyle);
                lastFeature = feature;

                /*Navbar*/
                $('#currentlyNav').click(e => {
                    $('.divInfo').hide();
                    $('#informations').show();
                });
                $('#todayNav').click(e => {
                    $('.divInfo').hide();
                    $('#informationsToday').show();
                });
                $('#nextDayNav').click(e => {
                    $('.divInfo').hide();
                    $('#informationsNext1').show();
                });
                $('#nextDay2Nav').click(e => {
                    $('.divInfo').hide();
                    $('#informationsNext2').show();
                });



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
        let currently = result.currently;
        let thisDay = result.daily.data[1];
        let nextDay1 = result.daily.data[2];
        let nextDay2 = result.daily.data[3];
        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point([key.long, key.lat]),
            name: key.name,
            //Week
            summaryWeek: result.daily.summary,
            //Currently
            temperature: currently.temperature,
            windSpeed: currently.windSpeed, // m/s
            visibility: currently.visibility, // KM
            precipitation: currently.precipIntensity,// mm/h
            precipitationProbability: currently.precipProbability, // %
            summary: currently.summary,
            icon: `./images/${currently.icon}.png`,
            //Today
            summaryToday: thisDay.summary,
            temperatureToday: (thisDay.temperatureHigh+thisDay.temperatureLow)/2,
            windSpeedToday: thisDay.windSpeed, // m/s
            visibilityToday: thisDay.visibility, // KM
            precipitationToday: thisDay.precipIntensity,// mm/h
            precipitationProbabilityToday: thisDay.precipProbability, // %
            iconToday: `./images/${thisDay.icon}.png`,
            //Next day
            summaryNext1: nextDay1.summary,
            temperatureNext1: (nextDay1.temperatureHigh+nextDay1.temperatureLow)/2,
            windSpeedNext1: nextDay1.windSpeed, // m/s
            visibilityNext1: nextDay1.visibility, // KM
            precipitationNext1: nextDay1.precipIntensity,// mm/h
            precipitationProbabilityNext1: nextDay1.precipProbability, // %
            iconNext1: `./images/${nextDay1.icon}.png`,
            //Next day 2
            summaryNext2: nextDay1.summary,
            temperatureNext2: (nextDay2.temperatureHigh+nextDay2.temperatureLow)/2,
            windSpeedNext2: nextDay1.windSpeed, // m/s
            visibilityNext2: nextDay1.visibility, // KM
            precipitationNext2: nextDay1.precipIntensity,// mm/h
            precipitationProbabilityNext2: nextDay1.precipProbability, // %
            iconNext2: `./images/${nextDay1.icon}.png`
            
        });
        iconFeature.setStyle(iconNormalStyle);
        return iconFeature;
    }
    var iconSelectStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: './images/place.png',
            scale: 0.1
        }))
    });
    var iconNormalStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            anchor: [0.5, 0.5],
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            opacity: 0.75,
            src: './images/place.png',
            scale: 0.05
        }))
    });
});


