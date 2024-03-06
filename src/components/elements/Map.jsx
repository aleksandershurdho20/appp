import React, { useState } from 'react';
import { MapContainer, TileLayer, Rectangle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DrawTools } from '../partials/map';

const DrawMap = () => {
  const [selectionBounds, setSelectionBounds] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startLatLng, setStartLatLng] = useState(null);

  const handleMapDragStart = (e) => {
    setIsDrawing(true);
    setStartLatLng(e.target.getBounds().getNorthWest());
  };

  const handleMapDragEnd = (e) => {
    setIsDrawing(false);
    setSelectionBounds(e.target.getBounds());
  };

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <DrawTools/>
      {/* <MapDragHandler onStart={handleMapDragStart} onEnd={handleMapDragEnd} />
      {isDrawing && startLatLng && selectionBounds && <Rectangle bounds={[startLatLng, selectionBounds.getSouthEast()]} />} */}
    </MapContainer>
  );
};

const MapDragHandler = ({ onStart, onEnd }) => {
  useMapEvents({
    dragstart: onStart,
    dragend: onEnd
  });
  return null;
};

export default DrawMap;

// import React, { useEffect, useRef } from "react";
// import { MapContainer, TileLayer } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import "leaflet-draw/dist/leaflet.draw.css";
// import { EditControl } from "react-leaflet-draw";
// import StatusIcon from "src/assets/Status.svg";
// function Map() {
//   const mapRef = useRef(null);

//   useEffect(() => {
//     if (!mapRef.current) {
//       const map = L.map("map").setView([19.04469, 72.9258], 12);

//       const osmUrl = "https://{s}.tile.osm.org/{z}/{x}/{y}.png";
//       const osmAttrib =
//         '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors';
//       const osm = L.tileLayer(osmUrl, {
//         maxZoom: 18,
//         attribution: osmAttrib,
//       }).addTo(map);

//       const drawnItems = new L.FeatureGroup();
//       map.addLayer(drawnItems);

//       const drawControl = new L.Control.Draw({
//         draw: {
//           polygon: false,
//           marker: false,
//           circlemarker: false,
//           rectangle: false,
//           circle: false,
//         },
//         edit: {
//           featureGroup: drawnItems,
//         },
//       });

//       map.addControl(drawControl);
//       // Function to create a text label marker
//       function createTextLabel(layer) {
//         var bounds = layer.getBounds();
//         var center = bounds.getCenter();

//         var text = "0/3 Samples"; 
//         var textMarker = L.marker(center, {
//           icon: new L.DivIcon({
//             className: "text-label",
//             html:
//               '<div style="color: #000; text-align: center; font-size:20px; font-weight:bold;">' +
//               text +
//               "</div>",
//             iconSize: [0, 0], 
//           }),
//         });

//         textMarker.addTo(map);

//         layer._textMarker = textMarker; 
//       }

//       map.on(L.Draw.Event.CREATED, function (e) {
//         var layer = e.layer;
//         drawnItems.addLayer(layer);
//         createTextLabel(layer); 
//       });

//       map.on(L.Draw.Event.EDITED, function (e) {
//         e.layers.eachLayer(function (layer) {
//           var bounds = layer.getBounds();
//           var center = bounds.getCenter();
//           layer._textMarker.setLatLng(
//             L.latLng(bounds.getNorth(), bounds.getCenter().lng),
//           );
//         });
//       });



//       map.on(L.Draw.Event.DELETED, function (e) {
//         e.layers.eachLayer(function (layer) {
//           map.removeLayer(layer._textMarker);
//         });
//       });

//       mapRef.current = map;
//     }
//   }, []);

//   return <div id="map" style={{ height: "400px" }}></div>;
// }

// export default Map;
