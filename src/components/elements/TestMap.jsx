import React, { useState, useRef } from "react";
import { MM } from "./ModestMap";
import { ReactMap } from "./ReactMap";
import { Path } from "./ReactMap/Path";

const mapCenter = [51.3510015, 3.20376];

export default function TestMap() {
  const [paths, setPaths] = useState([]);
  const [path, setPath] = useState([]);
  const [tempPath, setTempPath] = useState([]);
  const mapRef = useRef();
  const containerRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(8);
  const [isHovering, setIsHovering] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // State for editing mode
  const mapLayers = useRef([
    new MM.TemplatedLayer(
      "https://{S}.tile.openstreetmap.org/{Z}/{X}/{Y}.png",
      ["a", "b", "c"],
      "seaMap"
    ),
    new MM.TemplatedLayer(
      "https://tiles.openseamap.org/seamark/{Z}/{X}/{Y}.png",
      ["a", "b", "c"],
      "seaMap"
    ),
  ]);

  function handleMouseMove(event) {
    if (!isDrawing) return;
    setIsHovering(true);
    const x = event.clientX - containerRef.current.offsetLeft;
    const y = event.clientY - containerRef.current.offsetTop;

    const location = mapRef.current.pointLocation({ x, y });

    setTempPath([...path, [location.lat, location.lon]]);
  }

  function handleClick(event) {
    if (!isDrawing) return;
    const x = event.clientX - containerRef.current.offsetLeft;
    const y = event.clientY - containerRef.current.offsetTop;

    const location = mapRef.current.pointLocation({ x, y });

    setPath([...path, [location.lat, location.lon]]);
    setIsHovering(false);
  }

  const startDrawing = () => {
    setIsDrawing(true);
    setPath([]);
    setTempPath([]);
    if (isEditing) {
      setIsEditing(false);
    }
  };

  const deleteLastPoint = () => {
    setPath(path.slice(0, -1));
  };

  const cancelDrawing = () => {
    setIsDrawing(false);
    setIsHovering(false);
    setPath([]);
    setTempPath([]);
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    setPaths([...paths, path]);
    setPath([]);
    setTempPath([]);
    setIsHovering(false);
  };

  const clearAll = () => {
    setPath([]);
    setPaths([]);
    setTempPath([]);
    setIsDrawing(false);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <>
      <button onClick={startDrawing}>Draw a polyline</button>
      <button onClick={deleteLastPoint}>Delete last point</button>
      <button onClick={finishDrawing}>Finish</button>
      <button onClick={cancelDrawing}>Cancel</button>
      <button onClick={clearAll}>Clear All</button>
      <button onClick={toggleEdit}>Edit zones</button>
      <div
        ref={containerRef}
        style={{
          height: "700px",
          display: "flex",
          flexDirection: "column",
        }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        <ReactMap
          ref={mapRef}
          layers={mapLayers.current}
          center={mapCenter}
          zoom={zoom}
          className="mapPanel"
        >
          {paths.map((p, index) => (
            <Path key={index} points={p} stroke={2} editable={isEditing} />
          ))}

          <Path points={path} stroke={2} />
          <Path points={tempPath} stroke={2} isHovering={isHovering} />
        </ReactMap>
      </div>
    </>
  );
}
