import { useEffect, useState } from "react";
import { use2dContext, useMap, useMapObjects } from "../useMapObject";

export function MapObjectRenderer() {
  const [counter, setCounter] = useState(1);
  const context = use2dContext();
  const map = useMap();
  const mapObjects = useMapObjects();

  function draw() {
    if (!context || !map) return;

    const { canvas } = context;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const object of mapObjects || []) object.draw(context, map);
  }

  useEffect(() => {
    draw();
  }, [counter]);

  useEffect(() => {
    const render = () => {
      setCounter((c) => c + 1);

      timerId = requestAnimationFrame(render);
    };

    let timerId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(timerId);
  }, []);

  return <></>;
}
