import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { iconMarkerOwn, iconMarkerOpposite } from "./Marker";
import styles from "./index.module.scss";

function MapComponent(
  {
    user,
    profilesNearUser,
  }
) {
  const coordinateCenter = user.coordinates.length > 0 ? user.coordinates : [51.505, -0.09];
  const coordinateOwn = user.coordinates || [];

  return (
    <MapContainer
      className={styles.map}
      center={coordinateCenter}
      zoom={5}
      // scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {coordinateOwn.length > 0 && (
        <Marker icon={iconMarkerOwn} position={coordinateOwn}>
          <Popup>
            {user.name}
          </Popup>
        </Marker>
      )}

      {profilesNearUser.length > 0 && (
        profilesNearUser.map(profile => (
          profile.coordinates.length > 0 && (
            <Marker
              key={profile._id}
              icon={iconMarkerOpposite}
              position={profile.coordinates}
            >
              <Popup>
                {profile.name}
              </Popup>
            </Marker>
          )
        ))
      )}
    </MapContainer>
  );
}

export default MapComponent;
