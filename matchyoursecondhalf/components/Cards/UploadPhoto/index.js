import { useSelector, useDispatch } from "react-redux";
import { Controller } from "react-hook-form";
import { userProfile } from "store/user/profile";
import Loader from "components/Loader";
import cn from "classnames";
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
    photosAmount,
  }
) {
  const dispatch = useDispatch();
  const profile = useSelector(userProfile.selectors.profile);

  const onFileUpload = (e) => {

    if (!profile.isPremiumUser && photosAmount) {
      dispatch(userProfile.actions.TOGGLE_POPUP(true));
      return;
    }

    const file = e.target.files[0];
    if (typeof file !== 'undefined') {
      onChange(file);
    }
  };

  return (
    <div className={styles.wrap}>
      <label className={cn(
        styles.content,
        'p-2'
      )} title={title}>
        {loader ? (
          <Loader />
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
              <div className="text-center">
                <img
                  src="/img/cards/icon-upload-photo.svg"
                  alt=""
                  className={styles.icon}
                />
                <div className="text-md color-grey-600 text-semibold text-letter-1 mt-3 mt-sm-1">Click to upload</div>
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
