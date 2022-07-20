import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "components/Button";
import CheckboxField from "components/Form/CheckboxField";
import SelectField from "components/Form/SelectField";
import RangePicker from "components/RangePicker";
import AutocompleteField from "components/Form/AutocompleteField";
import AdvancedSearch from "./AdvancedSearch";
import { defaultValues, schema } from "./config";
import { ages, preferences } from "utils/constants";
import { includesEntries } from "utils/preps";
import { useDispatch, useSelector } from "react-redux";
import { usersProfiles } from "store/users/profiles";
import { additionalData } from "store/additional/additionalData";
import { userProfile } from "store/user/profile";
import { searchParams } from "store/users/searchParams";
import { auth } from "store/auth/auth";
import cn from "classnames";
import styles from "./index.module.scss";

const ageOptions = ages.map(age => ({ value: age, label: age }));
const preferencesOptions = Object.values(preferences).map(pref => ({ value: pref, label: pref }));
const rangePickerPoints = {
  startPoint: 0,
  endPoint: 250,
};

function GlobalListingSearch({ filterIsVisible }) {
  const dispatch = useDispatch();
  const [distanceIsVisible, setDistanceIsVisible] = useState(false);
  const additionalDataLocation = useSelector(additionalData.selectors.formattedLocation);
  const locationStatus = useSelector(additionalData.selectors.locationStatus);
  const additionalNational = useSelector(additionalData.selectors.nationals);
  const profile = useSelector(userProfile.selectors.profile);
  const paramsList = useSelector(searchParams.selectors.list);
  const currentToken = useSelector(auth.selectors.currentToken);

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });
  const watchLocation = Object.keys(watch('location')).length || null;

  useEffect(() => {
    if (watchLocation) {
      setDistanceIsVisible(true);
    } else {
      setDistanceIsVisible(false);
      setValue('distance', rangePickerPoints.endPoint);
    }
  }, [watchLocation]);

  const isLogged = useMemo(() => {
    return currentToken && Object.values(profile).length > 0;
  }, [currentToken, profile]);

  const setSearchParams = () => {
    if (!isLogged) {
      dispatch(searchParams.actions.RESET_STATE());
      return
    }

    const { gender, nationality, location, ...params } = paramsList;
    const defaultParams = { ...params };

    if (gender !== undefined) defaultParams.gender = gender;
    else defaultParams.gender = profile.preference;

    if (location !== undefined) defaultParams.location = location;
    else defaultParams.location = profile.location;

    if (nationality) defaultParams.nationality = nationality.name;

    reset({ ...defaultValues, ...defaultParams });
  };

  useEffect(() => {
    setSearchParams();
  }, []);

  const getLocation = value => {
    dispatch(additionalData.thunks.getAdditionalLocation({ cityName: value }));
  };

  const onClearOptions = () => {
    dispatch(additionalData.actions.RESET_LOCATION());
  };

  const onSubmit = async (data) => {
    const { location = {}, nationality, distance, ...params } = includesEntries(data);

    const national = additionalNational.find(national => national.name === nationality);

    if (location) params.location = location;
    if (nationality) params.nationality = national;
    if (distanceIsVisible) params.distance = distance;

    await dispatch(usersProfiles.actions.RESET_STATE());
    await dispatch(searchParams.actions.SET_SEARCH_PARAMS(params));
    await dispatch(usersProfiles.thunks.getUsersProfiles());
  };

  return (
    <div className={cn(styles.search, 'mb-4')}>
      {filterIsVisible && (
        <form className="py-4" onSubmit={handleSubmit(onSubmit)}>
          <div className={cn(styles['body__row'], 'mb-3')}>
            <div>
              <div className="text-md text-semibold ml-2">
                Age range
              </div>
              <div className="d-flex mt-1">
                <SelectField
                  name="minAge"
                  control={control}
                  options={ageOptions}
                  className="mr-2"
                  size="xs"
                  placeholder="18"
                />
                <SelectField
                  name="maxAge"
                  control={control}
                  options={ageOptions}
                  size="xs"
                  placeholder="99"
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold ml-2">
                Gender
              </div>
              <div className="mt-1">
                <SelectField
                  name="gender"
                  control={control}
                  options={preferencesOptions}
                  className={styles.gender}
                  size="md"
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold ml-2">Location</div>
              <div className="mt-1">
                <AutocompleteField
                  name="location"
                  options={additionalDataLocation}
                  control={control}
                  fullWidth
                  placeholder="Amsterdam"
                  loader={locationStatus === 'pending'}
                  onSubmit={getLocation}
                  onClearOptions={onClearOptions}
                />
              </div>
            </div>
            <div className={cn({ [styles['range--disabled']]: !distanceIsVisible })}>
              <div className="text-md text-semibold mb-2">Distance</div>
              <RangePicker
                name="distance"
                control={control}
                startPoint={rangePickerPoints.startPoint}
                endPoint={rangePickerPoints.endPoint}
                disabled={!distanceIsVisible}
              />
            </div>
          </div>
          <div className="mb-4">
            <div>
              <div className="text-md text-semibold mb-2">
                Users
              </div>
              <div className={cn(
                styles['user-checkboxes'],
                'd-flex'
              )}>
                <div className="d-flex mr-4">
                  <CheckboxField
                    name="isWithPhoto"
                    control={control}
                  />
                  <div className="ml-1">With photo</div>
                </div>
                <div className="d-flex mr-4">
                  <CheckboxField
                    name="isOnline"
                    control={control}
                  />
                  <div className="ml-1">Online</div>
                </div>
                <div className="d-flex">
                  <CheckboxField
                    name="isRegisterIn15Days"
                    control={control}
                  />
                  <div className="ml-1">Registered in the last 15 days</div>
                </div>
              </div>
            </div>
          </div>

          <AdvancedSearch control={control} />

          <div className={cn(styles.submit, 'd-flex justify-content-end')}>
            <Button
              text="Search"
              type="submit"
              dark
            />
          </div>
        </form>
      )}
    </div>
  );
}

export default GlobalListingSearch;
