import CheckboxField from "components/Form/CheckboxField";
import { useState } from 'react';
import styles from "./index.module.scss";

function ShareAlbum(
  {
    album,
    onSelect
  }
) {
  const [checked, setChecked] = useState(true);

  const handleToggleSelection = () => {
      setChecked(!checked);
      onSelect(album, checked);
  };

  return (
    <div className="d-flex align-items-center mb-2">
      <CheckboxField
        name={`album-${album._id}`}
        value={album.active}
        onChange={handleToggleSelection}
      />
      <div className={styles.thumb}>
        <img
          src={album.titlePhoto || '/img/cards/card-bg-default.png'}
          alt=""
          className="img-fit-cover"
        />
      </div>
      <div className="ml-2">{album.name}</div>
    </div>
  );
}

export default ShareAlbum;
