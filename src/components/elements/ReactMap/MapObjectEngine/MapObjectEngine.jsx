import { useEffect, useReducer, useRef } from "react";
import {
  MapObjectContext,
  MapObjectDispatchContext,
  defaultContextValue,
  reduce,
} from "./MapObjectContext";
import { MapObjectRenderer } from "../MapObjectRenderer";

function stopPropagation(event) {
  event.stopPropagation();
  event.stopImmediatePropagation();
  event.preventDefault();
}

export function MapObjectEngine({ mapRef, contextRef, children }) {
  const [mapContextValue, dispatchMapObjectAction] = useReducer(
    reduce,
    defaultContextValue
  );
  const handleMouseMoveRef = useRef();
  const handleMouseDownRef = useRef();
  const handleMouseUpRef = useRef();
  const mouseDownRef = useRef(false);
  const overSomethingRef = useRef(false);

  function handleMouseMove(event) {
    if (!mapContextValue.map) return;

    const container = mapContextValue.map.parent;

    const { clientX, clientY } = event;
    const { left, top } = container.getBoundingClientRect();

    const mousePosition = [clientX - left, clientY - top];

    const overSomething = (mapContextValue.objects || []).some((object) => {
      if (mouseDownRef.current)
        object.pan(mapContextValue.map, event.movementX, event.movementY);

      return object.over(mapContextValue.map, ...mousePosition);
    });

    mapContextValue.map.parent.style.cursor = overSomething
      ? "pointer"
      : "default";

    overSomethingRef.current = overSomething;
  }

  function handleMouseDown(event) {
    if (overSomethingRef.current) {
      stopPropagation(event);

      mouseDownRef.current = true;
    }
  }

  function handleMouseUp(event) {
    if (overSomethingRef.current) {
      stopPropagation(event);

      mouseDownRef.current = false;
    }
  }

  handleMouseMoveRef.current = handleMouseMove;
  handleMouseDownRef.current = handleMouseDown;
  handleMouseUpRef.current = handleMouseUp;

  useEffect(() => {
    dispatchMapObjectAction({
      action: "map",
      map: mapRef.current,
    });

    if (mapRef.current) {
      /**
       * @type {HTMLDivElement}
       */
      const container = mapRef.current.parent;

      container.addEventListener(
        "mousemove",
        (event) => {
          if (handleMouseMoveRef.current) handleMouseMoveRef.current(event);
        },
        { capture: true }
      );

      container.addEventListener(
        "mousedown",
        (event) => {
          if (handleMouseDownRef.current) handleMouseDownRef.current(event);
        },
        { capture: true }
      );

      container.addEventListener(
        "mouseup",
        (event) => {
          if (handleMouseUpRef.current) handleMouseUpRef.current(event);
        },
        { capture: true }
      );
    }
  }, [mapRef]);

  useEffect(() => {
    dispatchMapObjectAction({
      action: "context",
      context: contextRef.current,
    });
  }, [contextRef]);

  return (
    <MapObjectContext.Provider value={mapContextValue}>
      <MapObjectDispatchContext.Provider value={dispatchMapObjectAction}>
        {children}

        <MapObjectRenderer />
      </MapObjectDispatchContext.Provider>
    </MapObjectContext.Provider>
  );
}
