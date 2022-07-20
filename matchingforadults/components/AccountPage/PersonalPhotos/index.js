import PersonalBox from "../_shared/PersonalBox";
import PersonalBoxTitle from "../_shared/PersonalBoxTitle";
import PersonalAlbum from "../_shared/PersonalAlbum";
import Router from "next/router";
import { useState } from "react";

function PersonalPhotos() {
  const [albums, setAlbums] = useState({
    main: {
      _id: 1,
      title: 'Add main photos',
      amount: '0',
      link: '/account/photos/main-photos',
      className: 'mb-3',
      type: 'photos',
    },
    public: {
      _id: 2,
      title: 'Add public albums',
      amount: '0',
      link: '/account/photos/public-albums',
      className: 'mb-3',
      type: 'albums',
    },
    private: {
      _id: 3,
      title: 'Add private albums',
      amount: '0',
      link: '/account/photos/private-albums',
      className: '',
      type: 'albums',
    },
  });
  
  return (
    <PersonalBox>
      <PersonalBoxTitle>Photo/Albums</PersonalBoxTitle>
      <div className="d-flex flex-column align-items-center">
        {Object.values(albums).map(album => (
          <PersonalAlbum
            key={album._id}
            title={album.title}
            amount={album.amount}
            type={album.type}
            className={album.className}
            onClick={() => Router.push(album.link)}
          />
        ))}
      </div>
    </PersonalBox>
  );
}

export default PersonalPhotos;
