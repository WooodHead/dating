import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { prepareFormData } from "utils/preps";
import UploadPhoto from "components/Cards/UploadPhoto";
import SelectField from "components/Form/SelectField";
import RadioField from "components/Form/RadioField";
import DatePickerSimpleField from "components/Form/DatePickerSimpleField";
import { additionalData } from "store/additional/additionalData";
import { preferences } from "utils/constants";
import { addYears } from "date-fns";
import cn from "classnames";
import styles from "./index.module.scss";

const preferenceOptions = [
  { label: "Men", option: preferences.MALE },
  { label: "Women", option: preferences.FEMALE },
  { label: "All", option: preferences.ALL },
];

function PersonalBody({ control, getValues }) {
  const dispatch = useDispatch();
  const changeAvatarStatus = useSelector(userProfile.selectors.avatarStatus);
  const { professional, status, gender } = useSelector(additionalData.selectors.formattedEnums);
  
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
      </div>
      
      <div>
        <div className="d-flex align-items-start justify-content-between">
          <div className="text-xl text-black mt-1">Date of birth:</div>
          <DatePickerSimpleField
            name="dob"
            control={control}
            maxDate={addYears(new Date(), -18)}
            size="sm"
          />
        </div>
        <div className={cn(
          styles.row,
          'd-flex align-items-start justify-content-between'
        )}>
          <div className="text-xl text-black mt-1">Profession:</div>
          <SelectField
            name="professional"
            options={professional}
            control={control}
            placeholder="Profession"
            size="sm"
          />
        </div>
      </div>
      
      <div className={styles.status}>
        <div className={styles.row}>
          <div className="text-xl text-black mb-2">Status:</div>
          <div className="d-flex mb-3">
            <RadioField
              name="status"
              control={control}
              options={status}
              classes="mr-2"
            />
          </div>
        </div>
  
        <div className={styles.row}>
          <div className="text-xl text-black mb-2">Your gender:</div>
          <div className="d-flex mb-3">
            <RadioField
              name="gender"
              control={control}
              options={gender}
              classes="mr-2"
            />
          </div>
        </div>
  
        <div>
          <div className="text-xl text-black mb-2">Your preferences:</div>
          <div className="d-flex mb-3">
            <RadioField
              name="preference"
              control={control}
              options={preferenceOptions}
              classes="mr-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalBody;
