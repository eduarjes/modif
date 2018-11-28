


var map = L.map('map',{
        center: [39.29, -4.07],
        zoom: 6,
		maxZoom: 20,
		minZoom: 4,
		fullscreenControl: true,
		fullscreenControlOptions: { // optional
			title:"Mostrar pantalla completa",
			titleCancel:"Salir de pantalla completa"
		}
});

var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        tiled: true,
		attribution : 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap'
        +'</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">'
        +'CC-BY-SA</a>'
}).addTo(map);
var stamen = L.tileLayer('http://tile.stamen.com/terrain/{z}/{x}/{y}.jpg', {
		tiled: true,
		attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>'+
        ', under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>.'
});

var poblacion = L.tileLayer.wms("http://83.63.210.87:8080/geoserver/matrix/wms?", {
        layers: 'Variables_Demograficas',
		styles: 'poblacion_estilo',
        format: 'image/png',
		transparent: true,
		tiled: false,
		tileSize: 500,
        attribution: "Instituto Nacional de Estadística (2017)"
});

var densidad = L.tileLayer.wms("http://83.63.210.87:8080/geoserver/matrix/wms?", {
        layers: 'Variables_Demograficas',
		styles: 'densidad_estilo',
        format: 'image/png',
		transparent: true,
		tiled: false,
		tileSize: 500,
        attribution: "Instituto Nacional de Estadística (2017)"
});
var nacimientos = L.tileLayer.wms("http://83.63.210.87:8080/geoserver/matrix/wms?", {
        layers: 'Variables_Demograficas',
		styles: 'nacimiento_estilo',
        format: 'image/png',
		transparent: true,
		tiled: false,
		tileSize: 500,
        attribution: "Instituto Nacional de Estadística (2017)"
});
var defunciones = L.tileLayer.wms("http://83.63.210.87:8080/geoserver/matrix/wms?", {
        layers: 'Variables_Demograficas',
		styles: 'defunciones_estilo',
        format: 'image/png',
		transparent: true,
		tiled: false,
		tileSize: 500,
        attribution: "Instituto Nacional de Estadística (2017)"
});


var osm2 = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution : 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap'
        +'</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">'
        +'CC-BY-SA</a>'
});

var capaEdicion = new L.FeatureGroup();
map.on('draw:created', function (evento) {
        var layer = evento.layer;
        capaEdicion.addLayer(layer);
		capaEdicion.addTo(map);
});

var style = {
        fillColor: false,
        color: "#000",
        weight: 0,
        opacity: 0,
        fillOpacity: 0
};

var munici = L.geoJson(municipios,{ 
         style: style,
         onEachFeature: function(feature, layer){
                layer.bindPopup('<p><strong>Municipio:  </strong>'+feature.properties.NAMEUNIT+' ('+feature.properties.PROV+')</p><p><strong>Población (2016):  </strong>'+feature.properties.TOTAL_16+' habitantes</p><p><strong>Densidad (2016):  </strong>'+feature.properties.DENSI+' hab/km²</p><p><strong>Nacimientos (2015):  </strong>'+feature.properties.NACIM_15+'</p><p><strong>Defunciones (2015):  </strong>'+feature.properties.DEFUNC_15+'</p>');
        }
}).addTo(map);

L.control.scale({
        position: 'bottomright',
        imperial: false
}).addTo(map);

var baseMaps = {
    "Base de OpenStreetMap": osm,
	"Base de Terrain": stamen
};
var overlays = {
		"Número de habitantes por municipio (2016)": poblacion,
		"Densidad de población por municipio (2016)":densidad,
		"Nacimientos municipales (2015)":nacimientos,
		"Defunciones municipales (2015)":defunciones
};
var overlays2 = {
		"Edición": capaEdicion
};
L.control.layers(baseMaps).addTo(map);
L.control.layers(overlays, overlays2).addTo(map);


 
L.control.polylineMeasure({position:'topleft', imperial:false}).addTo(map);




var miniMap = new L.Control.MiniMap(osm2, { toggleDisplay: true }).addTo(map);

var drawControl = new L.Control.Draw({
	    draw: {
			    polyline: {
			        metric: true,
					repeatMode: true
		        },
				polygon: {
					repeatMode: true,
					showArea: true,
					shapeOptions: {
						color: 'purple'
					}
				},
				marker: {
					repeatMode: true,
				},
				rectangle: false,
				circle: false
			},
        edit: {
                featureGroup: capaEdicion
        },
});
        map.addControl(drawControl);

map.on('enterFullscreen', function(){
if(window.console) window.console.log('enterFullscreen');
});
map.on('exitFullscreen', function(){
if(window.console) window.console.log('exitFullscreen');
});

var legend = L.control({position: 'bottomleft'});
var legend_pobl = L.control({position: 'bottomleft'});
var legend_dens = L.control({position: 'bottomleft'});
var legend_nacim = L.control({position: 'bottomleft'});
var legend_defun = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
 
div.innerHTML +=
'<img alt="Legend" src="http://83.63.210.87:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=matrix:Variables_Demograficas" width="4" height="4" />';

    return div;
};

legend_pobl.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
 
div.innerHTML +=
'<img alt="Legend" src="http://83.63.210.87:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=matrix:Variables_Demograficas&style=matrix:poblacion_estilo" width="160" height="200" />';

    return div;
};

legend_dens.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
 
div.innerHTML +=
'<img alt="Legend" src="http://83.63.210.87:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=matrix:Variables_Demograficas&style=matrix:densidad_estilo" width="160" height="200" />';

    return div;
};

legend_nacim.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
 
div.innerHTML +=
'<img alt="Legend" src="http://83.63.210.87:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=matrix:Variables_Demograficas&style=matrix:nacimiento_estilo" width="160" height="200" />';

    return div;
};

legend_defun.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend');
 
div.innerHTML +=
'<img alt="Legend" src="http://83.63.210.87:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=matrix:Variables_Demograficas&style=matrix:defunciones_estilo" width="160" height="200" />';

    return div;
};

legend.addTo(map);
map.on('baselayerchange', function (eventLayer) {
    if (eventLayer.name === 'Número de habitantes por municipio (2016)') {
		map.removeControl(legend);
        map.removeControl(legend_dens);
		map.removeControl(legend_nacim);
		map.removeControl(legend_defun);
        legend_pobl.addTo(map);
    } else if(eventLayer.name === 'Densidad de población por municipio (2016)') { 
        map.removeControl(legend);
		map.removeControl(legend_pobl);
		map.removeControl(legend_nacim);
		map.removeControl(legend_defun);
        legend_dens.addTo(map);
    } else if(eventLayer.name === 'Nacimientos municipales (2015)') { 
        map.removeControl(legend);
		map.removeControl(legend_pobl);
		map.removeControl(legend_dens);
		map.removeControl(legend_defun);
        legend_nacim.addTo(map);
    } else if(eventLayer.name === 'Defunciones municipales (2015)') { 
        map.removeControl(legend);
		map.removeControl(legend_pobl);
		map.removeControl(legend_dens);
		map.removeControl(legend_nacim);
        legend_defun.addTo(map);
    } else {
		map.removeControl(legend_nacim);
		map.removeControl(legend_pobl);
		map.removeControl(legend_dens);
		map.removeControl(legend_defun);
        legend.addTo(map);
	}
});

var imagen = L.control({position: 'bottomleft'});

imagen.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info imagen');
 
div.innerHTML +=
'<img alt="Imagen" src="imagen.png" width="160" height="70" />';

    return div;
};

imagen.addTo(map);

var sidebar = L.control.sidebar('sidebar', {
            closeButton: true,
            position: 'left'
        });
        map.addControl(sidebar);

var button = new L.Control.Button(L.DomUtil.get('ayuda'), { toggleButton: 'active' });
	button.addTo(map);
	button.on('click', function () {
	 if (button.isToggled()) {
			sidebar.hide();
		} else {
			sidebar.show();
		}
	});

		sidebar.on('show', function () {
			console.log('Sidebar will be visible.');
		});
		sidebar.on('shown', function () {
			console.log('Sidebar is visible.');
		});
		sidebar.on('hide', function () {
			console.log('Sidebar will be hidden.');
		});
		sidebar.on('hidden', function () {
			console.log('Sidebar is hidden.');
		});
		L.DomEvent.on(sidebar.getCloseButton(), 'click', function () {
			console.log('Close button clicked.');
		});

