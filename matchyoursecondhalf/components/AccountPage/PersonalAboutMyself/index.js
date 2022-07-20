import UploadPhoto from "components/Cards/UploadPhoto";
import TextAreaField from "components/Form/TextAreaField";
import TextField from "components/Form/TextField";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { prepareFormData } from "utils/preps";
import RadioField from "components/Form/RadioField";
import { additionalData } from "store/additional/additionalData";
import { preferences } from "utils/constants";
import cn from "classnames";
import styles from "./index.module.scss";

function PersonalAboutMyself({ control, getValues }) {
  const dispatch = useDispatch();
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const changeAvatarStatus = useSelector(userProfile.selectors.avatarStatus);
  
  const preferenceOptions = [
    { label: "Men", option: preferences.MALE },
    { label: "Women", option: preferences.FEMALE },
    { label: "All", option: preferences.ALL },
  ];

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
      <div className="d-flex justify-content-between mb-3">
        <div className="title-xs text-semibold">
          My Profile
        </div>
        <div className={cn(
          styles.delete,
          'd-flex align-items-center cursor-pointer'
        )}>
          <img
              src="/img/buttons/icon-delete.svg"
              alt="Delete account"/>
          <div className="text-letter-0-3 color-grey-900 ml-1">
            Delete account
          </div>
        </div>
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
          <TextField
              id="name"
              label="Username"
              name="name"
              control={control}
              fullWidth
          />
          <TextAreaField
            label="About me"
            name="bio"
            control={control}
            helperFieldText="The maximum number of characters is 200"
            fullWidth
            placeholder="Please write a few lines about yourself, this information will be shown on your puddle page"
          />
        </div>
      </div>
      <div className={cn(
          styles.gender,
          'ml-2 ml-auto'
      )}>
        <div>
          <div className="text-md mb-2 color-blue-900">Status:</div>
          <div className="d-flex flex-column mb-3 mb-lg-0">
            <RadioField
              name="status"
              control={control}
              options={additionalDataEnums.status}
              classes="mb-2"
            />
          </div>
        </div>
        <div>
          <div className="text-md mb-2 color-blue-900">Gender:</div>
          <div className="d-flex flex-column mb-3 mb-lg-0">
            <RadioField
                name="gender"
                control={control}
                options={additionalDataEnums.gender}
                classes="mb-2"
            />
          </div>
        </div>
        <div>
          <div className="text-md mb-2 color-blue-900">Your preferences:</div>
          <div className="d-flex flex-column mb-3 mb-lg-0">
            <RadioField
              name="preference"
              control={control}
              options={preferenceOptions}
              classes="mb-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalAboutMyself;
