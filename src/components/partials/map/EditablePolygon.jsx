
import {useEffect,useRef} from "react"
import { Polygon} from 'react-leaflet';

const EditablePolygon = ({ positions, onEdit }) => {
    const polygonRef = useRef();
  
    // useEffect(() => {
    //   if (polygonRef.current && positions.length > 0) {
    //     polygonRef.current.leafletElement.setLatLngs(positions);
    //   }
    // }, [positions]);
  
    return (
      // <Polygon
      //   positions={positions}
      //   ref={polygonRef}
      //   eventHandlers={{
      //     editable: true,
      //     edit: onEdit,
      //   }}
      // />
      <Polygon
        positions={positions}
        eventHandlers={{
          editable: true,
          edit: onEdit
        }}
    />
    );
  };

  export default EditablePolygon