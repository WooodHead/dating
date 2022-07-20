import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addYears } from "date-fns";
import { additionalData } from "store/additional/additionalData";
import { genders, preferences } from "utils/constants";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import RadioField from "components/Form/RadioField";
import DatePickerField from "components/Form/DatePickerField";
import AutocompleteField from "components/Form/AutocompleteField"
import IconArrowButton from "components/icons/IconArrowButton";

const genderOptions = [
  { label: "Man", option: genders.MALE },
  { label: "Woman", option: genders.FEMALE },
];

const preferenceOptions = [
  { label: "Men", option: preferences.MALE },
  { label: "Women", option: preferences.FEMALE },
  { label: "All", option: preferences.ALL },
];

const FirstStep = ({ setStepCounter, control, getValues, trigger }) => {
  const dispatch = useDispatch();
  const additionalDataLocation = useSelector(additionalData.selectors.formattedLocation);
  const locationStatus = useSelector(additionalData.selectors.locationStatus);

  const isLocationStatusPending = useMemo(() => locationStatus === 'pending', [locationStatus]);

  const getLocation = useCallback(value => {
    dispatch(additionalData.thunks.getAdditionalLocation({ cityName: value }));
  }, [dispatch]);

  const onClearOptions = useCallback(() => {
    dispatch(additionalData.actions.RESET_LOCATION());
  }, [dispatch]);

  const onNextStep = () => {
    if (!!getValues('dob') && !!getValues('location')) {
      setStepCounter((prevState => ++prevState));
    } else {
      trigger('dob');
      trigger('location');
    }
  };

  return (
    <>
      <div className="text-md text-semibold mb-2">Your gender</div>
      <div className="d-flex align-items-center mb-2">
        <RadioField
          name="gender"
          control={control}
          options={genderOptions}
          classes="mr-4"
        />
      </div>
      <div className="text-md text-semibold mb-2">Your preferences</div>
      <div className="d-flex align-items-center mb-3">
        <RadioField
          name="preference"
          control={control}
          options={preferenceOptions}
          classes="mr-4"
        />
      </div>
      <DatePickerField
        label="Date of birth"
        name="dob"
        control={control}
        fullWidth
        maxDate={addYears(new Date(), -18)}
      />
      <TextField
        id="phone"
        label="Phone (optional)"
        name="phone"
        type="number"
        control={control}
        fullWidth
        noArrows
      />
      <AutocompleteField
        name="location"
        label="Location"
        options={additionalDataLocation}
        control={control}
        fullWidth
        prependIcon
        loader={isLocationStatusPending}
        onSubmit={getLocation}
        onClearOptions={onClearOptions}
      />
      <div className="mt-5">
        <Button
          fullWidth
          textSize="lg"
          size="md"
          onClick={onNextStep}
          text={
            <div className="d-flex justify-content-center align-items-center">
              <span>Next Step</span>
              <IconArrowButton className="ml-1" />
            </div>
          }
        />
      </div>
    </>
  )
};

export default FirstStep;