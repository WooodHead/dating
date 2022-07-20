import {useRouter} from "next/router";
import {useState} from "react";
import AccountPhotosLayout from "layouts/AccountPhotos";
import Avatar from "components/Avatar";
import CardAttachment from "components/Cards/CardAttachment";
import Pagination from "components/Pagination";
import ImagesGallery from "components/ImagesGallery";
import styles from "./index.module.scss";
import MainLayout from 'layouts/Main';

SharedCurrentAlbumPage.layouts = [MainLayout, AccountPhotosLayout]

function SharedCurrentAlbumPage() {
  const router = useRouter();

  const user = {id: 1, thumb: '', name: 'Username', amountAlbums: 6};

  const attachments = [
    {
      id: 1,
      original: 'https://picsum.photos/id/1018/1000/600/',
      thumbnail: 'https://picsum.photos/id/1018/250/150/',
      loaded: true
    },
    {
      id: 2,
      original: 'https://picsum.photos/id/1015/1000/600/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/',
      loaded: true
    },
    {
      id: 3,
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
      loaded: true
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);

  const handlePage = page => {
    setCurrentPage(page);
    // action
  };

  const [galleryIsVisible, setGalleryIsVisible] = useState(false);
  const [startIndexGallery, setStartIndexGallery] = useState(0);

  return (
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

      <div className="d-flex align-items-center mb-3">
        <div className="text-semibold">Polar night in the far north</div>
        <div className="ml-2">3 photos</div>
      </div>

      <div className={styles.list}>
        {attachments.map((attachment, key) => (
          <CardAttachment
            key={attachment.id}
            attachment={attachment}
            onClick={() => {
              setStartIndexGallery(key);
              setGalleryIsVisible(true);
            }}
          />
        ))}
      </div>
      {attachments.length > 0 && (
        <div className="d-flex justify-content-end mb-5">
          <Pagination
            current={currentPage}
            total={attachments.length}
            pageSize={attachments.length}
            onChange={handlePage}
          />
        </div>
      )}

      {galleryIsVisible && (
        <ImagesGallery
          images={attachments}
          startIndex={startIndexGallery}
          onClose={() => setGalleryIsVisible(false)}
        />
      )}
    </div>
  );
}

export default SharedCurrentAlbumPage;
