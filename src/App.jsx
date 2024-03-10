import "./App.css";
import Header from "./components/global/Header";
import { ReactMap } from "./components/elements/ReactMap";

// import { DrawableMap } from "./components/elements/ReactMap/";
function App() {
  return (
    <>
      <Header />
      <ReactMap className="mapPanel" />
    </>
  );
}

export default App;
