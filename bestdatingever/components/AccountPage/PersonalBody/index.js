import { useDispatch } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import cn from "classnames";
import styles from "./index.module.scss";

function PersonalBody({ control }) {
  return (
    <div className={styles.wrap}>
      {/*<div>
        <div>
          <div className="text-xl text-black mr-1">Date of birth</div>
          <DatePickerField
            name="dob"
            control={control}
            fullWidth
            maxDate={addYears(new Date(), -18)}
          />
        </div>
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
      </div>*/}
    </div>
  );
}

export default PersonalBody;
