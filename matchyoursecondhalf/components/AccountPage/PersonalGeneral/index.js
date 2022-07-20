import DatePickerField from "components/Form/DatePickerField";
import SelectField from "components/Form/SelectField";
import AutocompleteField from "components/Form/AutocompleteField";
import MultiSelectField from "components/Form/MultiSelectField";
import { useDispatch, useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import { addYears } from "date-fns";
import styles from "./index.module.scss";

function PersonalGeneral({ control }) {
  const dispatch = useDispatch();
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const additionalDataLang = useSelector(additionalData.selectors.formattedLang);
  const additionalDataNationals = useSelector(additionalData.selectors.formattedNationals);
  const additionalDataLocation = useSelector(additionalData.selectors.formattedLocation);
  const locationStatus = useSelector(additionalData.selectors.locationStatus);

  const getLocation = value => {
    dispatch(additionalData.thunks.getAdditionalLocation({ cityName: value }));
  };
  
  const onClearOptions = () => {
    dispatch(additionalData.actions.RESET_LOCATION());
  };

  return (
    <div className={styles.wrap}>
      <div className="title-xs text-semibold mb-3 color-blue-900">
        General description
      </div>
      <div className={styles.content}>
        <div className={styles['content__fields']}>
          <div>
            <DatePickerField
              label="Date of birth"
              name="dob"
              control={control}
              fullWidth
              maxDate={addYears(new Date(), -18)}
            />
            <AutocompleteField
              label="Location"
              name="location"
              options={additionalDataLocation}
              control={control}
              fullWidth
              placeholder="Amsterdam"
              loader={locationStatus === 'pending'}
              onSubmit={getLocation}
              prependIcon
              onClearOptions={onClearOptions}
            />
            <SelectField
              label="Profession"
              name="professional"
              options={additionalDataEnums.professional}
              control={control}
              fullWidth
              placeholder="Profession"
            />
          </div>
          <div>
            <MultiSelectField
              label="Languages"
              name="languages"
              options={additionalDataLang}
              control={control}
              fullWidth
              placeholder="English"
            />
            <SelectField
              label="Nationality"
              name="nationality"
              options={additionalDataNationals}
              control={control}
              fullWidth
              placeholder="French"
            />
            <SelectField
              label="Ethnic Origin"
              name="ethnic"
              options={additionalDataEnums.ethnic}
              control={control}
              fullWidth
              placeholder="European"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalGeneral;
