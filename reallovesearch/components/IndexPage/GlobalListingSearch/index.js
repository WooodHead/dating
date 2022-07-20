import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import IconChevronRight from "components/icons/IconChevronRight";
import Button from "components/Button";
import CheckboxField from "components/Form/CheckboxField";
import RangePicker from "components/RangePicker";
import AutocompleteField from "components/Form/AutocompleteField";
import RadioField from "components/Form/RadioField";
import AdvancedSearch from "./AdvancedSearch";
import { defaultValues, schema } from "./config";
import { preferences } from "utils/constants";
import { includesEntries } from "utils/preps";
import { useDispatch, useSelector } from "react-redux";
import { usersProfiles } from "store/users/profiles";
import { additionalData } from "store/additional/additionalData";
import { userProfile } from "store/user/profile";
import { searchParams } from "store/users/searchParams";
import { auth } from "store/auth/auth";
import cn from "classnames";
import styles from "./index.module.scss";

const preferencesOptions = [
  { label: "All", option: preferences.ALL },
  { label: "Men", option: preferences.MALE },
  { label: "Women", option: preferences.FEMALE },
];
const rangePickerPoints = {
  startPoint: 0,
  endPoint: 200,
};

function GlobalListingSearch({ filterIsVisible, setFilterIsVisible }) {
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

    const { gender, minAge, maxAge, nationality, location = {}, ...params } = paramsList;
    const defaultParams = { ...params };

    if (gender !== undefined) defaultParams.gender = gender;
    else defaultParams.gender = profile.preference;

    if (location !== undefined) defaultParams.location = location;
    else defaultParams.location = profile.location;

    if (minAge || maxAge) defaultParams.age = [minAge, maxAge];
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
    const { age, location = {}, nationality, distance, ...params } = includesEntries(data);

    const national = additionalNational.find(national => national.name === nationality);

    params.minAge = age[0];
    params.maxAge = age[1];
    if (location) params.location = location;
    if (nationality) params.nationality = national;
    if (distanceIsVisible) params.distance = distance;

    await dispatch(usersProfiles.actions.RESET_STATE());
    await dispatch(searchParams.actions.SET_SEARCH_PARAMS(params));
    await dispatch(usersProfiles.thunks.getUsersProfiles());

    setFilterIsVisible(false);
  };

  return (
    <div className={cn(styles.search, 'mb-4')}>
      <div
        className={cn(
          styles.head,
          'd-inline-flex align-items-center cursor-pointer'
        )}
        onClick={() => setFilterIsVisible(!filterIsVisible)}
      >
        <div className={styles['head__bg']} />
        <div className={cn(
          styles['title-content'],
          'd-inline-flex'
        )}>
          <div className="text-md text-medium text-poppins color-blue-900">
            Find people
          </div>
          <div className={cn(
            styles.icon,
            'd-flex justify-content-center align-items-center ml-4',
          )}>
            <IconChevronRight color="#031539" />
          </div>
        </div>
      </div>

      {filterIsVisible && (
        <div className={cn(
          styles['filters-wrapper'],
        )}>
          <div className={styles['filter-bg']} />
          <form
            className={cn(styles.form, 'custom-scroll color-blue-900')}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className={cn(
              styles['body__row'],
            )}>
              <div
                className="d-flex align-items-center justify-content-between mb-4 cursor-pointer"
                onClick={() => setFilterIsVisible(!filterIsVisible)}
              >
                <div className="text-md text-medium text-poppins">Find people</div>
                <div className={cn(
                  styles.icon,
                  'd-flex justify-content-center align-items-center ml-1 rotate-180',
                )}>
                  <IconChevronRight color="#031539" />
                </div>
              </div>
              <div className="mb-4">
                <div className="text-md text-semibold mb-2">
                  Gender
                </div>
                <div className="d-flex">
                  <RadioField
                    name="gender"
                    control={control}
                    options={preferencesOptions}
                    classes="mr-2"
                  />
                </div>
              </div>
              <div className="mb-4">
                <div className="text-md text-semibold">
                  Age range
                </div>
                <RangePicker
                  name="age"
                  control={control}
                  startPoint={18}
                  endPoint={99}
                  range
                />
              </div>
              <div className="mb-4">
                <div className="text-md text-semibold mb-2">City</div>
                <div>
                  <AutocompleteField
                    name="location"
                    options={additionalDataLocation}
                    control={control}
                    fullWidth
                    prependIcon
                    placeholder="Amsterdam"
                    loader={locationStatus === 'pending'}
                    onSubmit={getLocation}
                    onClearOptions={onClearOptions}
                  />
                </div>
              </div>
              <div className={cn(
                { [styles['range--disabled']]: !distanceIsVisible },
                'mb-4'
              )}>
                <div className="text-md text-semibold">Distance</div>
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
                <div>
                  <div className={cn(
                    styles.switch,
                    'mb-2'
                  )}>
                    <div className="text-md">With photo</div>
                    <CheckboxField
                      name="isWithPhoto"
                      control={control}
                      switcher
                    />
                  </div>
                  <div className={cn(
                    styles.switch,
                    'mb-2'
                  )}>
                    <div className="text-md">Online</div>
                    <CheckboxField
                      name="isOnline"
                      control={control}
                      switcher
                    />
                  </div>
                  <div className={cn(
                    styles.switch,
                    'mb-2'
                  )}>
                    <div>
                      <div className="text-md">New members</div>
                      <div className="text-sm text-italic color-grey-600">(registered in the last 15 days)</div>
                    </div>
                    <CheckboxField
                      name="isRegisterIn15Days"
                      control={control}
                      switcher
                    />
                  </div>
                </div>
              </div>
            </div>

            <AdvancedSearch control={control} />

            <div>
              <Button
                text="Search"
                type="submit"
                textSize="lg"
                fullWidth
              />
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default GlobalListingSearch;
