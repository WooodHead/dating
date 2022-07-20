import UploadPhoto from "components/Cards/UploadPhoto";
import TextAreaField from "components/Form/TextAreaField";
import { useDispatch, useSelector } from "react-redux";
import { userProfile } from "store/user/profile";
import { prepareFormData } from "utils/preps";
import PersonalBox from "../_shared/PersonalBox";
import InputField from "components/Form/InputField";
import AutocompleteField from "components/Form/AutocompleteField";
import { additionalData } from "store/additional/additionalData";
import { addYears } from "date-fns";
import DatePickerField from "components/Form/DatePickerField";
import SelectField from "components/Form/SelectField";
import RadioField from "components/Form/RadioField";
import MultiSelectField from "components/Form/MultiSelectField";
import { preferences } from "utils/constants";
import cn from "classnames";
import styles from "./index.module.scss";

const preferenceOptions = [
  { label: "Men", option: preferences.MALE },
  { label: "Women", option: preferences.FEMALE },
  { label: "All", option: preferences.ALL },
];

function PersonalAboutMyself({ control, getValues }) {
  const dispatch = useDispatch();
  const { name } = useSelector(userProfile.selectors.profile);
  const changeAvatarStatus = useSelector(userProfile.selectors.avatarStatus);
  const additionalDataLocation = useSelector(additionalData.selectors.formattedLocation);
  const locationStatus = useSelector(additionalData.selectors.locationStatus);
  const additionalDataLang = useSelector(additionalData.selectors.formattedLang);
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  
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
  
  const getLocation = value => {
    dispatch(additionalData.thunks.getAdditionalLocation({ cityName: value }));
  };
  
  const onClearOptions = () => {
    dispatch(additionalData.actions.RESET_LOCATION());
  };
  
  return (
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
      
      <PersonalBox className={cn(styles.info, 'ml-2 ml-sm-0')}>
        <div className="title-xs text-semibold text-overflow mb-3">
          {name}
        </div>
        
        <div className="d-flex">
          <div className={cn(styles.label, 'text-semibold mr-2')}>Location:</div>
          <AutocompleteField
            name="location"
            size="md"
            options={additionalDataLocation}
            control={control}
            placeholder="Amsterdam"
            loader={locationStatus === 'pending'}
            onSubmit={getLocation}
            onClearOptions={onClearOptions}
            prependIcon
          />
        </div>
        
        <div className={cn(styles.col, 'mb-2')}>
          <div className="text-semibold">Status:</div>
          <div className={styles.radio}>
            <RadioField
              name="status"
              control={control}
              options={additionalDataEnums.status}
              className="mr-2"
              theme="dark"
            />
          </div>
        </div>
        
        <div className={cn(styles.col, 'mb-2')}>
          <div className="text-semibold">Your preferences:</div>
          <div className={styles.radio}>
            <RadioField
              name="preference"
              control={control}
              options={preferenceOptions}
              className="mr-2"
              theme="dark"
            />
          </div>
        </div>
        
        <div className={cn(styles.col, 'mb-2')}>
          <div className="text-semibold">Your gender:</div>
          <div className={styles.radio}>
            <RadioField
              name="gender"
              control={control}
              options={additionalDataEnums.gender}
              className="mr-2"
              theme="dark"
            />
          </div>
        </div>
        
        <InputField
          label="Username"
          placeholder="Username"
          name="name"
          control={control}
          fullWidth
        />
        
        <TextAreaField
          label="About me"
          name="bio"
          control={control}
          helperFieldText="The maximum number of characters is 200"
          placeholder="Write something about you here"
          fullWidth
          outline
          defaultAreaHeight={100}
        />
        
        <div className={styles.col}>
          <div className={cn(styles.label, 'text-semibold mr-2')}>Languages:</div>
          <MultiSelectField
            name="languages"
            options={additionalDataLang}
            control={control}
            size="md"
            placeholder="English"
          />
        </div>
        
        <div className={styles.col}>
          <div className={cn(styles.label, 'text-semibold mr-2')}>Date of birth:</div>
          <DatePickerField
            label="Date of birth"
            name="dob"
            control={control}
            outline
            size="md"
            maxDate={addYears(new Date(), -18)}
          />
        </div>
        
        <div className={styles.col}>
          <div className={cn(styles.label, 'text-semibold mr-2')}>Profession:</div>
          <SelectField
            name="professional"
            options={additionalDataEnums.professional}
            control={control}
            size="md"
            placeholder="Profession"
          />
        </div>
      </PersonalBox>
    </div>
  );
}

export default PersonalAboutMyself;
