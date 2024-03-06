import { createContext } from "react";

export const defaultContextValue = {
  map: null,
  context: null,
  objects: [],
};

export const MapObjectContext = createContext(defaultContextValue);
export const MapObjectDispatchContext = createContext(null);

export function reduce(state, action) {
  if (action.action === "add")
    return {
      ...state,
      objects: [...(state.objects || []), action.object],
    };

  if (action.action === "remove")
    return {
      ...state,
      objects: (state.objects || []).filter(
        (object) => object.getId() !== action.objectId
      ),
    };

  if (action.action === "map")
    return {
      ...state,
      map: action.map,
    };

  if (action.action === "context") return { ...state, context: action.context };
}
