// import { MM } from './ModestMap';
// import React, { useEffect, useRef,useState } from 'react';

// export class MapPolyline {
//   /**
//    * This class represents a line which is drawn on a map.
//    * 
//    * @param {Object} measurements The array of Position quantity measurements.
//    * @param {String} color The color of the line in hex format #RRGGBB
//    * @param {Number} thickness The tickness of the stroke.
//    */
//   constructor(measurements, color, thickness) {
//     this.measurements = measurements;
//     this.color = color;
//     this.thickness = thickness;
//   };

//   /**
//    * Set a new array of measurements in this polyline.
//    * 
//    * @param {Array} measurements The array of position Measurement objects.
//    */
//   setMeasurements = (measurements) => {
//     this.measurements = measurements; 
//   };

//   /**
//    * Draw this object onto the map.
//    * 
//    * @param {Object} map The map to draw the object on.
//    * @param {Number} mapZoom The current map zoom level.
//    * @param {Object} canvas The canvas to draw the object on.
//    * 
//    * @return True when drawn, false if not.
//    */
//   draw = (map, mapZoom, canvas) => {
//     if(this.measurements.length <= 0) {
//       return false;
//     }

//     const ctx = canvas.getContext('2d');
//     ctx.strokeStyle = this.color;
//     ctx.lineWidth = this.thickness;
//     ctx.lineCap = 'round';
//     ctx.lineJoin = 'round';
//     ctx.beginPath();
//     let moved = false;
//     this.measurements.forEach(m => {
//       if(m.quantity !== quantity_types.POSITION) {
//         return;
//       }

//       const p = map.locationPoint({ lat: m.value.lat, lon: m.value.long });
//       if(!moved) {
//         ctx.moveTo(p.x,p.y);
//         moved = true;
//       } else {
//         ctx.lineTo(p.x,p.y);
//       }
//     });

//     ctx.stroke();
//     return true;
//   }
// };


// export class MapPolygon {
//     /**
//      * This class represents a polygon drawn on a map.
//      * 
//      * @param {Object} points The array of points defining the polygon.
//      * @param {String} color The color of the polygon in hex format #RRGGBB.
//      * @param {Number} thickness The thickness of the stroke.
//      * @param {String} fillColor The fill color of the polygon in hex format #RRGGBB.
//      */
//     constructor(points, color, thickness, fillColor) {
//       this.points = points;
//       this.color = color;
//       this.thickness = thickness;
//       this.fillColor = fillColor;
//     }
  
//     /**
//      * Set a new array of points for this polygon.
//      * 
//      * @param {Array} points The array of points defining the polygon.
//      */
//     setPoints = (points) => {
//       this.points = points;
//     };
  
//     /**
//      * Draw this polygon onto the map.
//      * 
//      * @param {Object} map The map to draw the polygon on.
//      * @param {Number} mapZoom The current map zoom level.
//      * @param {Object} canvas The canvas to draw the polygon on.
//      * 
//      * @return True when drawn, false if not.
//      */
//     draw = (map, mapZoom, canvas) => {
//       if (this.points.length <= 0) {
//         return false;
//       }
  
//       const ctx = canvas.getContext('2d');
//       ctx.strokeStyle = this.color;
//       ctx.lineWidth = this.thickness;
//       ctx.fillStyle = this.fillColor;
//       ctx.beginPath();
//       this.points.forEach((point, index) => {
//         const pixel = map.locationPoint(new MM.Location(point[0], point[1]));
//         if (index === 0) {
//           ctx.moveTo(pixel.x, pixel.y);
//         } else {
//           ctx.lineTo(pixel.x, pixel.y);
//         }
//       });
//       ctx.closePath();
//       ctx.fill();
//       ctx.stroke();
//       return true;
//     };
//   }
  
//   export const Map2 = ({ layers, center, zoom, objects = [], className }) => {
//     const mapId = useRef(`map-${(Math.random() + 1).toString(36).substring(7)}`);
//     const map = useRef(undefined);
//     const mapCanvas = useRef(undefined);
//     const lastZoom = useRef(undefined);
//     const lastCenter = useRef(undefined);
//     const lastRedrawTime = useRef(0);
//     const isDrawing = useRef(false);
//     const drawingPoints = useRef([]);
  
//     const [startDrawingLine,setStartDrawingLine]= useState(false)
//     const redraw = () => {
//       if (mapCanvas.current === undefined) {
//         return;
//       }
  
//       const ctx = mapCanvas.current.getContext('2d');
//       ctx.clearRect(0, 0, mapCanvas.current.width, mapCanvas.current.height);
//       const mapZoom = map.current.getZoom();
  
//       objects.forEach(obj => {
//         if (Array.isArray(obj)) {
//           obj.forEach(subObj => {
//             subObj.draw(map.current, mapZoom, mapCanvas.current)
//           });
//         } else {
//           obj.draw(map.current, mapZoom, mapCanvas.current)
//         }
//       });
  
//       if (isDrawing.current && drawingPoints.current.length > 1) {
//         ctx.strokeStyle = '#ff0000';
//         ctx.lineWidth = 2;
//         ctx.lineCap = 'round';
//         ctx.lineJoin = 'round';
//         ctx.beginPath();
//         drawingPoints.current.forEach((point, index) => {
//           const pixel = map.current.locationPoint(new MM.Location(point[0], point[1]));
//           if (index === 0) {
//             ctx.moveTo(pixel.x, pixel.y);
//           } else {
//             ctx.lineTo(pixel.x, pixel.y);
//           }
//         });
//         ctx.stroke();
//       }
  
//       lastRedrawTime.current = new Date().getTime();
//     };
  
//     const handleMouseDown = (event) => {
//       isDrawing.current = true;
//       drawingPoints.current = [];
//       const coords = map.current.pointLocation(new MM.Point(event.offsetX, event.offsetY));
//       drawingPoints.current.push([coords.lat, coords.lon]);
//     };
  
//     const handleMouseMove = (event) => {
//       if (isDrawing.current) {
//         const coords = map.current.pointLocation(new MM.Point(event.offsetX, event.offsetY));
//         drawingPoints.current.push([coords.lat, coords.lon]);
//         redraw();
//       }
//     };
  
//     const handleMouseUp = () => {
//       isDrawing.current = false;
//       if (drawingPoints.current.length > 2) {
//         const newPolygon = new MapPolygon(drawingPoints.current, '#ff0000', 2, '#ff000088');
//         newPolygon.setPoints(drawingPoints.current)
//         objects.push(newPolygon);
//         redraw();
//       }
//     };
  
//     useEffect(() => {
//       map.current = new MM.Map(mapId.current, layers, null, [
//         new MM.MouseWheelHandler(),
//         new MM.DragHandler(),
//         new MM.TouchHandler()
//       ]);
//       mapCanvas.current = MM.MapCanvas(map.current);
  
//       mapCanvas.current.addEventListener('mousedown', handleMouseDown);
//       mapCanvas.current.addEventListener('mousemove', handleMouseMove);
//       mapCanvas.current.addEventListener('mouseup', handleMouseUp);
  
//       map.current.addCallback('zoomed', () => {
//         redraw();
//       });
  
//       map.current.addCallback('panned', redraw);
//       map.current.addCallback('resized', function () {
//         canvas.width = map.dimensions.x;
//         canvas.height = map.dimensions.y;
//         redraw();
//       });
  
//       map.current.setCenterZoom(new MM.Location(center[0], center[1]), zoom);
//       lastZoom.current = zoom;
//       lastCenter.current = center;
  
//       redraw();
  
//       return () => {
//         mapCanvas.current.removeEventListener('click', handleMouseDown);
//         mapCanvas.current.removeEventListener('click', handleMouseMove);
//         mapCanvas.current.removeEventListener('click', handleMouseUp);
//       };
//     }, []);
  
//     if ((new Date().getTime() - lastRedrawTime.current) > 500) {
//       redraw();
//     }
  
//     if (map.current !== undefined) {
//       if (zoom !== lastZoom.current) {
//         map.current.setZoom(zoom);
//         lastZoom.current = zoom;
//       }
  
//       if (center !== lastCenter.current) {
//         map.current.setCenter(new MM.Location(center[0], center[1]));
//         lastCenter.current = center;
//       }
//     }
  
//     return (
//       <>
//         <button onClick={() => setStartDrawingLine(true)}>Start DRAWING</button>
//         <button onClick={() => setStartDrawingLine(false)}>stop DRAWING</button>

//         <div id={mapId.current} className={className} />
//       </>
//     )
//   };
  
//   export default Map2;









import { MM } from './ModestMap';
import React, { useEffect, useRef, useState } from 'react';

export class MapPolyline {
  /**
   * This class represents a line which is drawn on a map.
   *
   * @param {Object} measurements The array of Position quantity measurements.
   * @param {String} color The color of the line in hex format #RRGGBB
   * @param {Number} thickness The tickness of the stroke.
   */
  constructor(measurements, color, thickness) {
    this.measurements = measurements;
    this.color = color;
    this.thickness = thickness;
  };

  /**
   * Set a new array of measurements in this polyline.
   *
   * @param {Array} measurements The array of position Measurement objects.
   */
  setMeasurements = (measurements) => {
    this.measurements = measurements;
  };

  /**
   * Draw this object onto the map.
   *
   * @param {Object} map The map to draw the object on.
   * @param {Number} mapZoom The current map zoom level.
   * @param {Object} canvas The canvas to draw the object on.
   *
   * @return True when drawn, false if not.
   */
  draw = (map, mapZoom, canvas) => {
    if(this.measurements.length <= 0) {
      return false;
    }

    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.thickness;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    let moved = false;
    this.measurements.forEach(m => {
    //   if(m.quantity !== quantity_types.POSITION) {
    //     return;
    //   }

      const p = map.locationPoint({ lat: m.value.lat, lon: m.value.long });
      if(!moved) {
        ctx.moveTo(p.x,p.y);
        moved = true;
      } else {
        ctx.lineTo(p.x,p.y);
      }
    });

    ctx.stroke();
    return true;
  }
};

export const Map2 = ({ layers, center, zoom, objects = [], className }) => {
  const mapId = useRef(`map-${(Math.random() + 1).toString(36).substring(7)}`);
  const map = useRef(undefined);
  const mapCanvas = useRef(undefined);
  const lastZoom = useRef(undefined);
  const lastCenter = useRef(undefined);
  const lastRedrawTime = useRef(0);
  const [buttonText, setButtonText] = useState('Start Drawing');
  const context = useRef(null);
  const drawing = useRef(false);
  const startPosition = useRef(null);
  const endPosition = useRef(null);

  const redraw = () => {
    if (mapCanvas.current === undefined) {
      return;
    }

    const ctx = context.current;
    ctx.clearRect(0, 0, mapCanvas.current.width, mapCanvas.current.height);
    const mapZoom = map.current.getZoom();

    objects.forEach(obj => {
      if (Array.isArray(obj)) {
        obj.forEach(subObj => {
          subObj.draw(map.current, mapZoom, mapCanvas.current)
        });
      } else {
        obj.draw(map.current, mapZoom, mapCanvas.current)
      }
    });

    lastRedrawTime.current = new Date().getTime();
  };

  useEffect(() => {
    map.current = new MM.Map(mapId.current, layers, null, [
      new MM.MouseWheelHandler(),
      new MM.DragHandler(),
      new MM.TouchHandler()
    ]);
    mapCanvas.current = MM.MapCanvas(map.current);
    context.current = mapCanvas.current.getContext('2d');

    map.current.addCallback('zoomed', () => {
      redraw();
    });

    map.current.addCallback('panned', redraw);
    map.current.addCallback('resized', function () {
      canvas.width = map.dimensions.x;
      canvas.height = map.dimensions.y;
      redraw();
    });

    map.current.setCenterZoom(new MM.Location(center[0], center[1]), zoom);
    lastZoom.current = zoom;
    lastCenter.current = center;

    redraw();
  }, []);

  if ((new Date().getTime() - lastRedrawTime.current) > 500) {
    redraw();
  }

  if (map.current !== undefined) {
    if (zoom !== lastZoom.current) {
      map.current.setZoom(zoom);
      lastZoom.current = zoom;
    }

    if (center !== lastCenter.current) {
      map.current.setCenter(new MM.Location(center[0], center[1]));
      lastCenter.current = center;
    }
  }

  const startDrawing = (event) => {
    drawing.current = true;
    startPosition.current = getCanvasCoordinates(event);
  };

  const endDrawing = (event) => {
    if (drawing.current) {
      endPosition.current = getCanvasCoordinates(event);
      const line = new MapPolyline([
        { quantity: 'POSITION', value: { lat: startPosition.current.lat, long: startPosition.current.long } },
        { quantity: 'POSITION', value: { lat: endPosition.current.lat, long: endPosition.current.long } }
      ], '#000000', 2);
      objects.push(line);
      redraw();
      drawing.current = false;
      startPosition.current = null;
      endPosition.current = null;
    }
  };

  const getCanvasCoordinates = (event) => {
    const point = map.current.pointLocation(new MM.Point(event.clientX, event.clientY));
    return { lat: point.lat, long: point.lon };
  };

  useEffect(() => {
    if (mapCanvas.current) {
      mapCanvas.current.addEventListener('click', startDrawing);
      mapCanvas.current.addEventListener('click', endDrawing);
      return () => {
        mapCanvas.current.removeEventListener('click', startDrawing);
        mapCanvas.current.removeEventListener('click', endDrawing);
      };
    }
  }, [mapCanvas.current]);

  return (
    <>
      <button>{buttonText}</button>
      <div id={mapId.current} className={className} />
    </>
  );
};

export default Map2;
