import UploadPhoto from "components/Cards/UploadPhoto";
import TextAreaField from "components/Form/TextAreaField";
import TextField from "components/Form/TextField";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { prepareFormData } from "utils/preps";
import styles from "./index.module.scss";

function PersonalAboutMyself({ control, getValues }) {
  const dispatch = useDispatch();
  const changeAvatarStatus = useSelector(userProfile.selectors.avatarStatus);

  const onChange = avatarPath => {
    const file = prepareFormData({ avatar: avatarPath });
    const { dob, languages, location, nationality, ...values } = getValues();
    const lang = languages.map(lang => ({ _id: lang._id, name: lang.value }));
    dispatch(userProfile.thunks.changeAvatar({
      file,
      values: {
        ...values,
        location: {
          _id: location._id,
          cityName: location.value,
          country: { pathToFlag: location.path }
        },
        nationality: { name: nationality },
        languages: lang,
        dob: new Date(dob).toISOString()
      }
    }));
  };

  return (
    <div className={styles.wrap}>
      <div className="text-xl text-bold mb-3">
        1 Photo and story about myself
      </div>
      <div className={styles.content}>
        <div className={styles.upload}>
          <UploadPhoto
            name="avatarPath"
            control={control}
            onChange={onChange}
            loader={changeAvatarStatus === 'pending'}
            title="Upload file"
          />
        </div>
        <div className={styles.info}>
          <div className="mb-4 mb-md-1">
            <div className="text-md text-bold mb-4 mb-md-1">About you</div>
            <div className="text-italic mb-2 mb-md-1">
              Please write a few lines about yourself, this information will be shown on your puddle page
            </div>
            <TextAreaField
              name="bio"
              control={control}
              helperFieldText="The maximum number of characters is 200"
              fullWidth
            />
          </div>
          <TextField
            id="name"
            label="Username"
            name="name"
            control={control}
            fullWidth
          />
        </div>
      </div>
    </div>
  );
}

export default PersonalAboutMyself;
