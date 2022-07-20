import { useState } from "react";
import AccountPhotosLayout from "layouts/AccountPhotos";
import Avatar from "components/Avatar";
import ListEmpty from "components/ListEmpty";
import Pagination from "components/Pagination";
import Router from "next/router";
import MainLayout from 'layouts/Main';

SharedPrivateAlbumsPage.layouts = [MainLayout, AccountPhotosLayout]

function SharedPrivateAlbumsPage() {
  const usersList = [
    { id: 1, thumb: '', name: 'Username', amountAlbums: 6 },
    { id: 2, thumb: '', name: 'Oleg Pavlov', amountAlbums: 45 },
    { id: 3, thumb: '', name: 'Pedro Moraliz', amountAlbums: 63 },
    { id: 4, thumb: '', name: 'Arturito Ganzalez', amountAlbums: 3 },
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const handlePage = page => {
    setCurrentPage(page);
    // action
  };

  return (
    <>
      <div className="mb-4">
        {usersList.map(user => (
          <div
            key={user.id}
            className="d-flex align-items-center mb-2 cursor-pointer"
            onClick={() => Router.push({
              pathname: '/account/shared/private-albums/[userId]',
              query: { userId: user.id },
            })}
          >
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
        ))}
        {!usersList.length && (
          <ListEmpty text="No results"/>
        )}
      </div>
      {usersList.length > 0 && (
        <div className="d-flex justify-content-end mb-5">
          <Pagination
            current={currentPage}
            total={usersList.length}
            pageSize={usersList.length}
            onChange={handlePage}
          />
        </div>
      )}
    </>
  );
}

export default SharedPrivateAlbumsPage;
