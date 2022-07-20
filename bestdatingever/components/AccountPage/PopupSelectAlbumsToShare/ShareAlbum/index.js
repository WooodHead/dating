import CheckboxField from "components/Form/CheckboxField";
import styles from "./index.module.scss";

function ShareAlbum(
  {
    album,
    onSelect
  }
) {
  return (
    <div className="d-flex align-items-center mb-2">
      <CheckboxField
        name={`album-${album.id}`}
        value={album.active}
        onChange={(checked) => onSelect(checked, album)}
        dark
      />
      <div className={styles.thumb}>
        <img
          src={album.thumb}
          alt=""
          className="img-fit-cover"
        />
      </div>
      <div className="ml-2">{album.name}</div>
    </div>
  );
}

export default ShareAlbum;
