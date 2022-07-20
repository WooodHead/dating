import { Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { userProfile } from "store/user/profile";
import Loader from "components/Loader";
import styles from "./index.module.scss";
import cn from "classnames";

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
    className,
  }
) {
  const dispatch = useDispatch();
  const profile = useSelector(userProfile.selectors.profile);

  const onFileUpload = (e) => {
     if (!profile.isPremiumUser && photosAmount) {
         dispatch(userProfile.actions.TOGGLE_POPUP(true));
         return
     }
    const file = e.target.files[0];
    if (typeof file !== 'undefined') {
      onChange(file);
    }
  };
  
  return (
    <div className={cn(styles.wrap, className)}>
      <label className={styles.content} title={title}>
        {loader ? (
          <Loader color="white"/>
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
                <div className={styles.text}>Upload photo</div>
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
