import { useEffect, useState } from "react";
import { generateId } from "../generateId";
import { DrawableObject } from "../DrawableObject";
import { useMapObjectDispatch } from "../useMapObject";
import { distance } from "src/utils/distance";

export class _Path extends DrawableObject {
  static MIN_HOVER_TOLERANCE = 1;

  hovering = null;
  points = [];
  stroke = 1;
  isHovering = false;
  editable = false;
  draggerRadius = 15;

  constructor() {
    super(`map_object_${generateId()}`);
  }

  setPoints(points) {
    this.points = points;
  }

  setStroke(stroke) {
    this.stroke = stroke;
  }

  setIsHovering(hover) {
    this.isHovering = hover;
  }

  setEditable(editable) {
    this.editable = editable;
  }

  /**
   *
   * @param {CanvasRenderingContext2D} context
   * @param {*} map
   */
  draw(context, map) {
    const points = this.points.map((point) =>
      map.locationPoint(new MM.Location(...point))
    );

    context.beginPath();

    context.strokeStyle = "black";
    context.lineWidth = this.stroke;
    this.isHovering && context.setLineDash([5, 15]);

    for (let i = 1; i < points.length; i++) {
      const last = points[i - 1];
      const current = points[i];

      context.moveTo(last.x, last.y);
      context.lineTo(current.x, current.y);

      if (!this.editable && i - 1 === this.hovering) {
        context.lineWidth = this.stroke * 3;
        context.stroke();
        context.lineWidth = this.stroke;
      } else context.stroke();

      context.closePath();
      context.beginPath();
    }

    context.closePath();
    context.setLineDash([]);

    if (this.editable) {
      context.beginPath();
    
      points.forEach((point, index) => {
        context.moveTo(point.x, point.y);
    
        let nextPoint = points[index + 1];
        if (nextPoint) {
          let midX = (point.x + nextPoint.x) / 2;
          let midY = (point.y + nextPoint.y) / 2;
    
          context.beginPath();
          context.arc(midX, midY, this.draggerRadius * (this.hovering === index + 0.5 ? 1.5 : 1), 0, 2 * Math.PI);
          context.fill();
        }
    
        context.beginPath();
        context.arc(point.x, point.y, this.draggerRadius * (this.hovering === index ? 1.5 : 1), 0, 2 * Math.PI);
        context.fill();
      });
    
      context.closePath();
    }
  }

  overWhenEditable(cursor, points) {
    let hoveringIndex = null;

    points.forEach((point, index) => {
      const d = distance(cursor, [point.x, point.y]);

      if (d <= this.draggerRadius) {
        hoveringIndex = index;
        return;
      }

      if (index < points.length - 1) {
        const nextPoint = points[index + 1];
        const midX = (point.x + nextPoint.x) / 2;
        const midY = (point.y + nextPoint.y) / 2;
        const d = distance(cursor, [midX, midY]);

        if (d <= this.draggerRadius) {
          hoveringIndex = index + 0.5;
          
        }
      }
    });
    this.hovering = hoveringIndex;
    return hoveringIndex !== null;

  }

  over(map, x, y) {
    const points = this.points.map((point) =>
      map.locationPoint(new MM.Location(...point))
    );
    const cursor = [x, y];
    if (!this.editable) {
      this.hovering = null;
      return false;
    }
    return this.overWhenEditable(cursor, points);
  }

  pan(map, offsetX, offsetY) {
    // if (!this.hovering) return;
    if (typeof this.hovering !== "number") return
    const point = map.locationPoint(
      new MM.Location(...this.points[this.hovering])
    );
    


    
    const { lat, lon } = map.pointLocation(
      new MM.Point(point.x + offsetX, point.y + offsetY)
    );
    

    this.points[this.hovering] = [lat, lon];
  }
}

export function Path({ points, stroke, isHovering, editable }) {
  const [object, setObject] = useState(null);
  const dispatch = useMapObjectDispatch();

  if (object) {
    object.setPoints(points);
    object.setStroke(stroke);
    object.setIsHovering(!!isHovering);
    object.setEditable(!!editable);
  }

  useEffect(() => {
    const path = object || new _Path();
    setObject(path);

    dispatch({
      action: "add",
      object: path,
    });

    return () => {
      dispatch({
        action: "remove",
        objectId: path.getId(),
      });
    };
  }, []);

  return null;
}
