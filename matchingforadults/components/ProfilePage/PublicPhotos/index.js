import PublicBox from "../PublicBox";
import PublicBoxTitle from "../PublicBoxTitle";
import PublicAlbum from "../PublicAlbum";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { useState } from "react";
import Router, { useRouter } from "next/router";

// import styles from "./index.module.scss";

function PublicPhotos() {
  const router = useRouter();
  const dispatch = useDispatch();
  const profile = useSelector(userProfile.selectors.profile);
  const [albums, setAlbums] = useState({
    main: {
      _id: 1,
      title: 'Main photos',
      amount: '0',
      link: 'main-photos',
      className: 'mb-3',
      type: 'photos',
    },
    public: {
      _id: 2,
      title: 'Public albums',
      amount: '0',
      link: 'public-albums',
      className: 'mb-3',
      type: 'albums',
    },
    private: {
      _id: 3,
      title: 'Private albums',
      amount: '0',
      link: 'private-albums',
      className: '',
      type: 'albums',
    },
  });

  const handleOnTabClick = (link) => {
    const isAccessibleAlbums = !profile.isPremiumUser && link === 'public-albums' ||
        !profile.isPremiumUser && link === 'private-albums';
    if (isAccessibleAlbums) {
      dispatch(userProfile.actions.TOGGLE_POPUP(true));
      return;
    }
    Router.push(`${router.query.userId}/${link}`);
  }
  
  return (
    <PublicBox className="mb-5">
      <PublicBoxTitle>Photo/Albums</PublicBoxTitle>
      <div className="d-flex flex-column align-items-center">
        {Object.values(albums).map(album => (
          <PublicAlbum
            key={album._id}
            title={album.title}
            amount={album.amount}
            type={album.type}
            className={album.className}
            onClick={() => handleOnTabClick(album.link)}
          />
        ))}
      </div>
    </PublicBox>
  );
}

export default PublicPhotos;
