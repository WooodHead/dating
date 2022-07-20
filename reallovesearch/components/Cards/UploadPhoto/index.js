import { Controller } from "react-hook-form";
import { useEffect } from "react";
import Loader from "components/Loader";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { userProfile } from "store/user/profile";
import styles from "./index.module.scss";

function UploadPhotoComponent(
  {
    value,
    error,
    helperText,
    onChange = () => {
    },
    loader,
    title,
    photosAmount
  }
) {
  // const [demoFile, setDemoFile] = useState(null);
  const dispatch = useDispatch();
  const profile = useSelector(userProfile.selectors.profile);
  const changeAvatarStatus = useSelector(userProfile.selectors.avatarStatus);

  // useEffect(() => {
  //   if (changeAvatarStatus === 'fail') {
  //     setDemoFile(null);
  //   }
  // }, [changeAvatarStatus]);

  const onFileUpload = (e) => {
    if (!profile.isPremiumUser && photosAmount) {
        dispatch(userProfile.actions.TOGGLE_POPUP(true));
        return
    }

    const file = e.target.files[0];
    if (typeof file !== 'undefined') {
      // setDemoFile(URL.createObjectURL(file));
      onChange(file);
    }
  };

  return (
    <div className={styles.wrap}>
      <label className={styles.content} title={title}>
        {loader ? (
          <Loader/>
        ) : (
          <>
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={onFileUpload}
            />

            {value ? (
              <div className={styles['img-uploaded']}>
                <img
                  src={value}
                  alt="Avatar"
                  className="img-fit-cover"
                />
              </div>
            ) : (
              <div className="text-center p-1">
                <img
                  src="/img/cards/icon-upload-photo.svg"
                  alt=""
                  className={styles.icon}
                />
                <div className="mt-3 text-semibold text-md color-blue-900">Upload photo</div>
              </div>
            )}
          </>
        )}
      </label>
    </div>
  );
}

function UploadPhoto(
  {
    control,
    name,
    ...rest
  }
) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <UploadPhotoComponent
          value={value || ''}
          onChange={onChange}
          error={!!error}
          name={name}
          helperText={error?.message ?? ''}
          {...rest}
        />
      )}
    />
  );
}

export default UploadPhoto;
