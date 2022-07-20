import { useState, memo, useRef, useMemo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { throttle } from "utils/throttle";
import { shareAlbums } from "store/users/share";
import ShareAlbum from "./ShareAlbum";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import Button from "components/Button";
import cn from "classnames";
import styles from "./index.module.scss";

const PopupSelectAlbumsToShare = ({
    onConfirm,
    userId,
    setPopup,
  }) => {
  const containerRef = useRef();
  const dispatch = useDispatch();
  const albumsList = useSelector(shareAlbums.selectors.shareAlbums);
  const shareAlbumsStatus = useSelector(shareAlbums.selectors.shareAlbumsStatus);

  const [selectedAlbums, setSelectedAlbums] = useState([]);

  const isShareAlbumsSearchPending = useMemo(() => shareAlbumsStatus === 'pending', [shareAlbumsStatus]);

  useEffect(() => {
    dispatch(shareAlbums.thunks.getShareAlbums({userId}));
  }, []);

  const handleConfirmAlbums = () => {
    onConfirm(selectedAlbums);
  };

  const onSelectAlbum = useCallback((album, checked) => {
      checked ?
      setSelectedAlbums((prev) => [...prev, {...album}]) :
      setSelectedAlbums((prev) => [...prev.filter((item) => album._id !== item._id)]);
  }, [selectedAlbums]);

  const handleCancelShare = () => {
    setPopup(false);
    setSelectedAlbums([]);
  }

  function handleContainerScroll() {
    if (!containerRef.current) return;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <IconButton
          className={styles['icon-close']}
          onClick={handleCancelShare}
        >
          <IconClose/>
        </IconButton>
        <div className="text-xl text-semibold text-center mb-3">
          Select the albums you want to share
        </div>
        <div
            className={cn([styles.wrap, 'custom-scroll dark mb-2'])}
            ref={containerRef}
            onScroll={throttle(handleContainerScroll, 500)}
        >
          {albumsList.length ? albumsList.map(album => (
              <ShareAlbum
                  key={album._id}
                  album={album}
                  onSelect={onSelectAlbum}
              />
          )) : (
              <p className="text-lg">You don&apos;t have private albums yet</p>
          )}
        </div>
        <div className={styles.actions}>
          <Button
            text="Submit"
            textSize="md"
            loader={isShareAlbumsSearchPending}
            onClick={handleConfirmAlbums}
            disabled={!selectedAlbums.length}
          />
          <Button
            text="Cancel"
            textSize="md"
            outline
            onClick={handleCancelShare}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(PopupSelectAlbumsToShare);
