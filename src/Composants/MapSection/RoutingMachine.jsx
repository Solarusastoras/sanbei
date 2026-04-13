import L from "leaflet";
import { createControlComponent } from "@react-leaflet/core";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const createRoutingMachineLayer = ({ start, end }) => {
  const instance = L.Routing.control({
    waypoints: [
      L.latLng(start[0], start[1]),
      L.latLng(end[0], end[1])
    ],
    lineOptions: {
      styles: [{ color: "#770aa5ff", weight: 6, opacity: 0.8 }]
    },
    altLineOptions: {
      styles: [{ color: "#666", weight: 4, opacity: 0.4, dashArray: '5, 10' }]
    },
    show: false, // Hide the textual instructions panel
    addWaypoints: false,
    routeWhileDragging: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: true // Show multiple routes
  });

  return instance;
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

export default RoutingMachine;
