import L from 'leaflet';

const iconMarkerOwn = new L.Icon({
  iconUrl: '/img/map/marker-own.svg',
  iconRetinaUrl: '/img/map/marker-own.svg',
  iconAnchor: null,
  // popupAnchor: [-3, -76],
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(34, 34),
  // className: 'leaflet-marker'
});

const iconMarkerOpposite = new L.Icon({
  iconUrl: '/img/map/marker-opposite.svg',
  iconRetinaUrl: '/img/map/marker-opposite.svg',
  iconAnchor: null,
  // popupAnchor: [-3, -76],
  shadowUrl: null,
  shadowSize: null,
  shadowAnchor: null,
  iconSize: new L.Point(34, 34),
  // className: 'leaflet-marker'
});

export {
  iconMarkerOwn,
  iconMarkerOpposite,
};