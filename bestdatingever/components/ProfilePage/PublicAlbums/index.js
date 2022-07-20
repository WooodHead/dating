import { useEffect, useState } from "react";
import CardAlbum from "components/Cards/CardAlbum"
import Pagination from "components/Pagination";
import ListEmpty from "components/ListEmpty";
import PublicCurrentAlbum from "components/ProfilePage/PublicCurrentAlbum";
import Loader from "components/Loader";
import { publicAlbums } from "store/profile/public-albums";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import styles from "./index.module.scss";
import Username from "../PublicDescription/Username";

function PublicAlbums() {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const userId = router.query.userId;
  const albums = useSelector(publicAlbums.selectors.albums);
  const albumsStatus = useSelector(publicAlbums.selectors.getAlbumsStatus);
  const currentAlbum = useSelector(publicAlbums.selectors.currentAlbum);
  const currentAlbumStatus = useSelector(publicAlbums.selectors.currentAlbumStatus);
  const albumCount = useSelector(publicAlbums.selectors.albumsCount);
  const pagination = useSelector(publicAlbums.selectors.pagination);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  
  useEffect(() => {
    const getAlbums = async () => {
      await dispatch(publicAlbums.thunks.getPublicAlbums({ userId }));
    }
    
    getAlbums();
  }, []);
  
  useEffect(() => {
    const getInfo = async () => {
      await dispatch(publicAlbums.thunks.getPublicAlbumInfo(currentAlbumId));
    }
    
    if (currentAlbumId) {
      getInfo()
    }
  }, [currentAlbumId])
  
  const handlePage = async page => {
    setCurrentPage(page);
    await dispatch(publicAlbums.actions.CHANGE_PAGE(page));
    await dispatch(publicAlbums.thunks.getPublicAlbums({ userId }));
  };
  
  if (['idle', 'pending'].includes(albumsStatus)) return <Loader />
  
  return (
    <>
      <Username />
      
      {!currentAlbumId ? (
        <>
          <div className={styles.wrap}>
            <div className={styles['wrap__bg']}/>
            
            <div className={styles.list}>
              {albums.map(album => (
                <CardAlbum
                  key={album._id}
                  album={album}
                  onClick={() => setCurrentAlbumId(album._id)}
                />
              ))}
              {!albums.length && (
                <ListEmpty text="No results" />
              )}
            </div>
          </div>
          
          {albums.length > 0 && (
            <div className="d-flex justify-content-end mb-5">
              <Pagination
                current={currentPage}
                total={albumCount}
                pageSize={pagination.take}
                onChange={handlePage}
              />
            </div>
          )}
        </>
      ) : (
        currentAlbumStatus === 'success' ? (
          <PublicCurrentAlbum
            albumInfo={currentAlbum}
            albumId={currentAlbumId}
            backToAlbums={async () => {
              await dispatch(publicAlbums.actions.RESET_CURRENT_ALBUM())
              setCurrentAlbumId(null)
            }}
          />
        ) : (
          <Loader />
        )
      )}
    </>
  );
}

export default PublicAlbums;
