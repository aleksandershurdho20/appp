import { MM } from "../ModestMap";
import { useEffect, useRef, useState } from "react";
import { Zone } from "./Zone";

export const ReactMap = ({ className }) => {
  const zones = useRef([]);
  const tempZone = useRef(new Zone());
  const isDrawing = useRef(false);
  const isMouseDown = useRef(false);

  const mapId = useRef(`map-${(Math.random() + 1).toString(36).substring(7)}`);
  const map = useRef(undefined);
  const mapCanvas = useRef(undefined);
  const lastZoom = useRef(8);
  const lastCenter = useRef([51.3510015, 3.20376]);
  const lastRedrawTime = useRef(0);

  const [zoom, setZoom] = useState(8);
  const [isEditing, setIsEditing] = useState(false);

  const layers = useRef([
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

  const startDrawing = () => {
    isDrawing.current = true;
  };

  const cancelDrawing = () => {
    isDrawing.current = false;

    tempZone.current = new Zone();
  };

  const finishDrawing = () => {
    isDrawing.current = false;

    zones.current.push(tempZone.current);
    tempZone.current = new Zone();
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const redraw = () => {
    if (mapCanvas.current === undefined) {
      return;
    }

    const ctx = mapCanvas.current.getContext("2d");
    ctx.clearRect(0, 0, mapCanvas.current.width, mapCanvas.current.height);
    const mapZoom = map.current.getZoom();
    
    [tempZone.current, ...zones.current].forEach((obj) => {
      obj.draw(ctx, map.current, mapZoom);
    });

    lastRedrawTime.current = new Date().getTime();
  };

  useEffect(() => {
    if (map.current !== undefined) {
      return;
    }

    map.current = new MM.Map(mapId.current, layers.current, null, [
      new MM.MouseWheelHandler(),
      new MM.DragHandler(),
      new MM.TouchHandler(),
    ]);

    mapCanvas.current = MM.MapCanvas(map.current);

    mapCanvas.current.addEventListener("mousedown", (event) => {
      isMouseDown.current = true;

      const ctxPoint = { x: event.offsetX, y: event.offsetY };
      const locPoint = map.current.pointLocation(ctxPoint);
      
      if (isDrawing.current) {
        tempZone.current.mouseDown(
          ctxPoint,
          locPoint,
          isDrawing.current,
          map.current,
          event
        );
      } else {
        zones.current.some((zone) => {
          const { stopIteration, stopPropagation } = zone.mouseDown(
            ctxPoint,
            locPoint,
            isDrawing.current,
            map.current,
            event
          );

          if (stopPropagation) {
            event.stopImmediatePropagation();
            event.stopPropagation();
          }

          return stopIteration;
        });
      }

      redraw();
    });

    mapCanvas.current.addEventListener("mouseup", (event) => {
      isMouseDown.current = false;
    });

    mapCanvas.current.addEventListener("mousemove", (event) => {
      const ctxPoint = { x: event.offsetX, y: event.offsetY };
      const locPoint = map.current.pointLocation(ctxPoint);

      zones.current.some((zone) => {
        const { stopIteration, stopPropagation } = zone.mouseMove(
          ctxPoint,
          locPoint,
          isMouseDown.current,
          map.current,
          event
        );

        if (stopPropagation) {
          event.stopImmediatePropagation();
          event.stopPropagation();
        }

        return stopIteration;
      });

      redraw();
    });

    map.current.addCallback("zoomed", () => {
      redraw();
    });

    map.current.addCallback("panned", redraw);
    map.current.addCallback("resized", function () {
      canvas.width = map.dimensions.x;
      canvas.height = map.dimensions.y;
      redraw();
    });

    map.current.setCenterZoom(
      new MM.Location(lastCenter.current[0], lastCenter.current[1]),
      lastZoom.current
    );
  }, []);

  if (new Date().getTime() - lastRedrawTime.current > 500) {
    redraw();
  }

  if (map.current !== undefined) {
    if (zoom !== lastZoom.current) {
      map.current.setZoom(zoom);
      lastZoom.current = zoom;
    }

    // if(center !== lastCenter.current) {
    //   map.current.setCenter(new MM.Location(center[0], center[1]));
    //   lastCenter.current = center;
    // }
  }

  return (
    <>
      <button onClick={startDrawing}>Draw a polyline</button>
      <button onClick={finishDrawing}>Finish</button>
      <button onClick={cancelDrawing}>Cancel</button>
      <button onClick={toggleEdit}>Edit zones</button>
      <div id={mapId.current} className={className} />
    </>
  );
};
