import { useDispatch, useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import AutocompleteField from "components/Form/AutocompleteField";
import SelectField from "components/Form/SelectField";
import PersonalHeader from "../_shared/Header";
import styles from "./index.module.scss";

function PersonalGeography({ control }) {
  const dispatch = useDispatch();
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const additionalDataLocation = useSelector(additionalData.selectors.formattedLocation);
  const additionalDataNationals = useSelector(additionalData.selectors.formattedNationals);
  const locationStatus = useSelector(additionalData.selectors.locationStatus);
  
  const getLocation = value => {
    dispatch(additionalData.thunks.getAdditionalLocation({ cityName: value }));
  };
  
  const onClearOptions = () => {
    dispatch(additionalData.actions.RESET_LOCATION());
  };
  
  return (
    <div>
      <PersonalHeader>Geography</PersonalHeader>
      <div className={styles.row}>
        <div className="text-xl text-black text-nowrap mt-1 mr-2">Nationality:</div>
        <SelectField
          name="nationality"
          options={additionalDataNationals}
          control={control}
          fullWidth
          placeholder="Nationality"
          size="sm"
        />
      </div>
      <div className={styles.row}>
        <div className="text-xl text-black text-nowrap mt-1 mr-2">Ethnic Origin:</div>
        <SelectField
          name="ethnic"
          options={additionalDataEnums.ethnic}
          control={control}
          fullWidth
          placeholder="European"
          size="sm"
        />
      </div>
      <div className={styles.row}>
        <div className="text-xl text-black text-nowrap mt-1 mr-2">Location:</div>
        <AutocompleteField
          name="location"
          options={additionalDataLocation}
          control={control}
          fullWidth
          placeholder="Amsterdam"
          loader={locationStatus === 'pending'}
          onSubmit={getLocation}
          prependIcon
          onClearOptions={onClearOptions}
          size="sm"
        />
      </div>
    </div>
  );
}

export default PersonalGeography;
