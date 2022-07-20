import { useState } from "react";
import { useRouter } from "next/router";
import Avatar from "components/Avatar";
import CardAlbum from "components/Cards/CardAlbum";
import ListEmpty from "components/ListEmpty";
import Pagination from "components/Pagination";
import styles from "./index.module.scss";
import MainLayout from 'layouts/Main';

SharedPrivateAlbumsByUserPage.layouts = [MainLayout];

function SharedPrivateAlbumsByUserPage() {
  const router = useRouter();
  
  const user = { id: 1, thumb: '', name: 'Username', amountAlbums: 6 };
  
  const albums = [
    {
      id: 1,
      thumb: '',
      name: 'Polar night in the far north',
      amount: 12,
      permission: true
    },
    {
      id: 2,
      thumb: '',
      name: 'Polar night in the far north',
      amount: 24,
      permission: true
    },
  ];
  
  const [currentPage, setCurrentPage] = useState(1);
  
  const handlePage = page => {
    setCurrentPage(page);
    // action
  };
  
  return (
    <>
      <div>
        <div className="d-flex align-items-center mb-3">
          <Avatar
            size="xs"
            thumb={user.thumb}
            name={user.name}
          />
          <div className="text-lg text-semibold ml-1">
            {user.name}
          </div>
          <div className="ml-1">
            ({user.amountAlbums} shared private albums)
          </div>
        </div>
        <div className={styles.list}>
          {albums.map(album => (
            <CardAlbum
              key={album.id}
              album={album}
              onClick={(albumId) => router.push({
                pathname: '/account/shared/private-albums/[userId]/album/[albumId]',
                query: {
                  userId: router.query.userId,
                  albumId: albumId
                },
              })}
            />
          ))}
          {!albums.length && (
            <ListEmpty text="No results" />
          )}
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
      </div>
    </>
  );
}

export default SharedPrivateAlbumsByUserPage;
