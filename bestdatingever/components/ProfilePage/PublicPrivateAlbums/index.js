import { useState } from "react";
import CardAlbum from "components/Cards/CardAlbum"
import ListEmpty from "components/ListEmpty";
import Pagination from "components/Pagination";
import styles from "./index.module.scss";

function PublicPrivateAlbums() {
  const albums = [
    {
      id: 1,
      thumb: '',
      name: 'Polar night in the far north',
      amount: 12,
      permission: false
    },
    {
      id: 2,
      thumb: '',
      name: 'Polar night in the far north',
      amount: 24,
      permission: false
    },
    {
      id: 3,
      thumb: '',
      name: 'Polar night in the far north',
      amount: 152,
      permission: false
    },
    {
      id: 4,
      thumb: '',
      name: 'Polar night in the far north',
      amount: 568,
      permission: false
    },
    {
      id: 5,
      thumb: '',
      name: 'Polar night in the far north',
      amount: 1,
      permission: false
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);

  const handlePage = page => {
    setCurrentPage(page);
    // action
  };

  return (
    <>
      <div className={styles.wrap}>
        <div className={styles.list}>
          {albums.map(album => (
            <CardAlbum
              key={album.id}
              album={album}
              onClick={(albumId) => setCurrentAlbumId(albumId)}
            />
          ))}
          {!albums.length && (
            <ListEmpty text="No results"/>
          )}
        </div>
      </div>
      {albums.length > 0 && (
        <div className="d-flex justify-content-end mb-5">
          <Pagination
            current={currentPage}
            total={albums.length}
            pageSize={albums.length}
            onChange={handlePage}
          />
        </div>
      )}
    </>
  );
}

export default PublicPrivateAlbums;
