import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { privateAlbums } from "store/profile/private-albums";
import CardAlbum from "components/Cards/CardAlbum"
import ListEmpty from "components/ListEmpty";
import Pagination from "components/Pagination";
import PublicAlbumsHead from "components/ProfilePage/PublicAlbumsHead";
import Loader from "components/Loader";
import styles from "./index.module.scss";

function PublicPrivateAlbums() {
  const dispatch = useDispatch();
  const router = useRouter();

  const userId = router.query.userId
  const albums = useSelector(privateAlbums.selectors.albums);
  const albumsStatus = useSelector(privateAlbums.selectors.getAlbumsStatus);
  const albumsCount = useSelector(privateAlbums.selectors.albumsCount);
  const pagination = useSelector(privateAlbums.selectors.pagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);

  useEffect(() => {
    const getAlbums = async () => {
      await dispatch(privateAlbums.thunks.getPrivateAlbums({userId}))
    }

    getAlbums();
  }, [])

  const handlePage = async page => {
    setCurrentPage(page);
    await dispatch(privateAlbums.actions.CHANGE_PAGE(page));
    dispatch(privateAlbums.thunks.getPrivateAlbums({userId}))
  };

  if (['idle', 'pending'].includes(albumsStatus)) return <Loader/>

  return (
    <>
      <PublicAlbumsHead>Private albums</PublicAlbumsHead>
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
        <div className="d-flex justify-content-center mb-5">
          <Pagination
            current={currentPage}
            total={albumsCount}
            pageSize={pagination.take}
            onChange={handlePage}
          />
        </div>
      )}
    </>
  );
}

export default PublicPrivateAlbums;
