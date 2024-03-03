import { useEffect, useState } from "react";
import { useMapObjectDispatch } from "../useMapObject";

export const Zone = ({zone}) => {
  const [object, setObject] = useState(null);
  const dispatch = useMapObjectDispatch();

  if (object) {
    object.setIndex(index);
    object.setPoints(start, end);
    object.setPaths(paths);
    object.setStroke(stroke);
    object.setIsHovering(!!isHovering);
    object.setEditable(!!editable);
  }

  useEffect(() => {
    const path = object || new _Path(index, start, end, paths, setPaths);
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
