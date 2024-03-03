import { useContext } from "react";
import {
  MapObjectContext,
  MapObjectDispatchContext,
} from "./MapObjectEngine/MapObjectContext";

export function useMapObjects() {
  const { objects } = useContext(MapObjectContext);

  return objects;
}

export function useMap() {
  const { map } = useContext(MapObjectContext);

  return map;
}

export function use2dContext() {
  const { context } = useContext(MapObjectContext);

  return context;
}

export function useMapObjectDispatch() {
  const mapObjectDispatch = useContext(MapObjectDispatchContext);

  return mapObjectDispatch;
}
