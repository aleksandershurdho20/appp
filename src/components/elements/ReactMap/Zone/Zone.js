/**
 * A ZonePoint represents a point in a zone.
 */
export class ZonePoint {
    /**
     * Construct a new ZonePoint.
     * 
     * @param {Number} idx The index of the point in the zone. 
     * @param {Number} lat The latitude of the point.
     * @param {Number} lon The longitude of the point.
     */
    constructor(lat, lon, idx = -1) {
        this.lat = lat;
        this.lon = lon;
        this.idx = idx;
        this.isFocused = false;
    };

    /**
     * Get the {x,y} canvas coordinates of this point.
     * 
     * @param {ModestMap} map The map to use to convert the coordinates.
     */
    ctxCoord = (map) => {
        return map.locationPoint(this);
    };

    /**
     * Get the distance between this point and a point on the canvas.
     * 
     * @param {Object} ctxPoint An object {x,y} which contains the canvas point to get the distance to.
     * @param {ModestMap} map The map to use to convert the coordinates.
     * 
     * @returns The distance as a number.
     */
    ctxDistance = (ctxPoint, map) => {
        const ourLoc = this.ctxCoord(map);
        return Math.sqrt((ourLoc.x - ctxPoint.x) ** 2 + (ourLoc.y - ctxPoint.y) ** 2);
    };

    /**
     * Get the center between two points in canvas coordinates.
     * 
     * @param {ZonePoint} point The other point.
     * @param {ModestMap} map The map to use to convert the coordinates.
     * 
     * @returns {Object} The center as an {x,y} object.
     */
    ctxCenterToOther = (point, map) => {
        const ourLoc = this.ctxCoord(map);
        const otherLoc = point.ctxCoord(map);

        const centerX = (ourLoc.x + otherLoc.x) / 2;
        const centerY = (ourLoc.y + otherLoc.y) / 2;
        return {x: centerX, y: centerY}
    };
}

/**
 * A zone represents a collection of points which form a closed shape.
 */
export class Zone {
    /**
     * Construct a new zone.
     * 
     * @param {Number} id The database id of the zone.
     * @param {String} name The human readable name of the zone.
     * @param {Array} points The collection of coordinates that form the zone in the
     * form of {lat, lon} objects.
     */
  constructor(id = -1, name = 'new', points = []) {
    this.id = id;
    this.name = name;
    this.points = points.map((p, idx) => new ZonePoint(p.lat, p.lon, idx));
  };

  /**
   * Add a new point to the zone.
   * 
   * @param {Number} lat The latitude of the point.
   * @param {Number} lon The longitude of the point.
   * @param {Number} idx The index of the point in the zone or -1 to add it as the last point.
   */
  addPoint = (lat, lon, idx = -1) => {
    const point = new ZonePoint(lat, lon, idx);

    if(idx = -1) {
      this.points.push(point);
    } else {
      this.points.splice(idx, 0, point);
    }
  };

  /**
   * Draw the zone on the map.
   * 
   * @param {CanvasRenderingContext2D} ctx The context to draw on. 
   * @param {ModestMap} map The map over which the canvas is overlayed.
   */
  draw = (ctx, map) => {
    if(this.points?.length === 0) {
        return;
    }
    
    // Draw the zone bounding box
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    const startCtx = this.points[0].ctxCoord(map);
    ctx.moveTo(startCtx.x, startCtx.y);

    for(let i = 1; i < this.points.length; ++i) {
        const pointCtx = this.points[i].ctxCoord(map);
        ctx.lineTo(pointCtx.x, pointCtx.y);
    }

    if(this.points.length > 1) {
        ctx.lineTo(startCtx.x, startCtx.y);
    }
    
    ctx.stroke();
    ctx.closePath();

    // Draw the ZonePoint circles
    for(let i = 0; i < this.points.length; ++i) {
        const pointCtx = this.points[i].ctxCoord(map);
        ctx.beginPath();
        ctx.arc(pointCtx.x, pointCtx.y, 15 * (this.points[i].isFocused ? 1.4 : 1), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    // Draw center circle to add points to a zone
    if(this.points.length < 2) {
        return;
    }

    let prevPoint = this.points[this.points.length - 1];
    for(let i = 0; i < this.points.length; ++i) {
        const curPoint = this.points[i];
        const center = curPoint.ctxCenterToOther(prevPoint, map);

        ctx.beginPath();
        ctx.arc(center.x, center.y, 5 * (this.points[i].isFocused ? 1.4 : 1), 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        prevPoint = curPoint;
    }
  }

  /**
   * Handle a mouse down event.
   * 
   * @param {Object} ctxPoint The location of the point expressed in canvas coordinates {x,y}.
   * @param {Object} locPoint The location of the point expressed in latitude, longitude {lat,lon}.
   * @param {Boolean} isDrawing True when the user is in zone draw mode.
   * @param {ModestMap} map The modest map
   * @param {Event} event The event which triggered this function.
   * 
   * @return {Object} An object which contains {stopIteration, stopPropagation} flags.
   */
  mouseDown = (ctxPoint, locPoint, isDrawing, map, event) => {
    if(isDrawing) {
      this.addPoint(locPoint.lat, locPoint.lon);
    } else {
      // Check if we are on a center
      if(this.points.length < 2) {
        return {
          stopIteration: true,
          stopPropagation: false
        };
      }

      let prevPoint = this.points[this.points.length - 1];
      for(let i = 0; i < this.points.length; ++i) {
          const curPoint = this.points[i];
          const center = curPoint.ctxCenterToOther(prevPoint, map);

          const distanceToCenter = Math.sqrt((center.x - ctxPoint.x) ** 2 + (center.y - ctxPoint.y) ** 2)
          if(distanceToCenter < 15) {
            this.addPoint(locPoint.lat, locPoint.lon, i);
            console.log('added center point')
            break;
          }
          prevPoint = curPoint;
      }
    }

    return {
      stopIteration: true,
      stopPropagation: false
    };
  }; 

  /**
   * Handle a mouse movement event.
   * 
   * @param {Object} ctxPoint The location of the point expressed in canvas coordinates {x,y}.
   * @param {Object} locPoint The location of the point expressed in latitude, longitude {lat,lon}.
   * @param {Boolean} isMouseDown True when the mouse is clicked, false if not.
   * @param {ModestMap} map The modest map
   * @param {Event} event The event which triggered this function.
   * 
   * @return {Object} An object which contains {stopIteration, stopPropagation} flags.
   */
  mouseMove = (ctxPoint, locPoint, isMouseDown, map, event) => {
    // Update the focus state of a point
    this.points.forEach((point, idx) => {
        point.isFocused = point.ctxDistance(ctxPoint, map) < 15;
    });

    if(!isMouseDown) {
        return {
            stopIteration: false,
            stopPropagation: false
        }
    }

    let selectedPoint = undefined;
    for(let i = 0; i < this.points.length; ++i) {
        if(this.points[i].ctxDistance(ctxPoint, map) < 50) {
            selectedPoint = this.points[i];
            break;
        }
    }

    if(selectedPoint !== undefined) {
        selectedPoint.lat = locPoint.lat;
        selectedPoint.lon = locPoint.lon;
    }




    // const cStart = map.locationPoint(this.start);
    // const cEnd = map.locationPoint(this.end);
    // const cCenter = this.center === undefined ? undefined : map.locationPoint(this.center);

    // this.startHover = pointDistance(cStart, {x, y}) < this.draggerRadius;
    // this.endHover = pointDistance(cEnd, {x, y}) < this.draggerRadius;

    // if(cCenter != undefined) {
    //   this.centerHover = pointDistance(cCenter, {x, y}) < this.draggerRadius;
    // } else {
    //   this.centerHover = false;
    // }

    // if(isMouseDown) {
    //   if(this.startHover) {
    //     this.setPoints(map.pointLocation({x, y}), this.end, map);
    //   }

    //   if(this.endHover) {
    //     this.setPoints(this.start, map.pointLocation({x, y}), map);
    //   }
    // }

    // const isOnPathHandle = this.startHover || this.centerHover || this.endHover;
    return {
        stopIteration: false,
        stopPropagation: selectedPoint !== undefined
    };
  }
};