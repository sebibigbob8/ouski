/***************************************************
 * Definition of global JS application parameters
 **************************************************/

/*
 * With the Boundless GeoServer you can play with layers:
 * - ne_10m_admin_0_countries
 * - ne_10m_lakes
 * - etc (see http://demo.boundlessgeo.com/geoserver/wms?REQUEST=GetCapabilities)
 */
var blWMS = "http://demo.boundlessgeo.com/geoserver/wms";

/*
 * With the MapCentia MapServer you can play with layers:
 * - public.world_simple
 * - public.cities
 * - public.cantonsch_region
 * - etc (see https://eu1.mapcentia.com/wms/oertz/public?service=WMS&request=GetCapabilities)
 */
var mcWMS = "https://eu1.mapcentia.com/wms/oertz/public";
var mcWFS = "https://eu1.mapcentia.com/wfs/oertz/public/4326";

/* With the new MapCentia "GeoCloud2" you can play with layers:
 * - public.world_simple
 * - public.cities
 * (the OWS services does include WMS up to 1.3 and WFS up to 2.0 see
 *  http://gc2.mapcentia.com/ows/oertz/public?service=WMS&request=GetCapabilities
 *  http://gc2.mapcentia.com/ows/oertz/public?service=WFS&request=GetCapabilities)
 */
var gcOWS = "http://gc2.mapcentia.com/ows/oertz/public";

/*
 * With G2C GeoServer you can play with layers (only from the school network, or by VPN):
 * - worldadm
 * - cities
 * - etc (see http://geoteach.heig-vd.ch:8080/geoserver/geoinfo/wms?service=WMS&version=1.1.0&request=GetCapabilities)
 */
var myOWS = "http://geoteach.heig-vd.ch:8080/geoserver/geoinfo/wms";

/*
 * With the Swisstopo MapServer you can play with layers:
 * - ch.swisstopo.swissboundaries3d-kanton-flaeche.fill
 * - ch.swisstopo.swissboundaries3d-gemeinde-flaeche.fill
 * - etc (see http://wms.geo.admin.ch/?REQUEST=GetCapabilities&SERVICE=WMS&VERSION=1.0.0&lang=fr)
 */
var chWMS = "https://wms.geo.admin.ch";

/*
 * With the UNEP GRID GeoServer you can play with layers
 * (see the Global Risk Data Platform map at http://preview.grid.unep.ch/index.php?preview=map):
 * - World
 * - NationalParks
 * - Cities_esri
 * - etc (see http://preview.grid.unep.ch/geoserver/wms?REQUEST=GetCapabilities)
 */
var unWMS = "http://preview.grid.unep.ch:8080/geoserver/preview/wms";
var unWFS = "http://preview.grid.unep.ch/geoserver/wfs";


/*
 * May be some useful functions
 */
function showExtent(bbox) {
    vectors = new ol.layer.Vector({source: new ol.source.Vector()});
    map.addLayer(vectors);
    vectors.getSource().addFeatures([new ol.Feature({geometry: new ol.geom.Polygon.fromExtent(bbox)})]);
}

//Api darkSky key
var darksky = 'https://api.darksky.net/forecast/575865c1909ad6b768fb6c623f2f7884';
