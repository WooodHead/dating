import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addYears } from "date-fns";
import { userProfile } from "store/user/profile";
import { additionalData } from "store/additional/additionalData";
import { prepareFormData } from "utils/preps";
import UploadPhoto from "components/Cards/UploadPhoto";
import TextAreaField from "components/Form/TextAreaField";
import TextField from "components/Form/TextField";
import AutocompleteField from "components/Form/AutocompleteField";
import RadioField from "components/Form/RadioField";
import SelectField from "components/Form/SelectField";
import DatePickerField from "components/Form/DatePickerField";
import MultiSelectField from "components/Form/MultiSelectField";
import IconClose from "components/icons/IconClose";
import cn from "classnames";
import styles from "./index.module.scss";

function PersonalAboutMyself({ control, getValues, watch, setValue }) {
  const dispatch = useDispatch();
  const changeAvatarStatus = useSelector(userProfile.selectors.avatarStatus);
  const additionalDataLang = useSelector(additionalData.selectors.formattedLang);
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const additionalDataLocation = useSelector(additionalData.selectors.formattedLocation);

  const locationStatus = useSelector(additionalData.selectors.locationStatus);
  const [nameIsEdit, setNameIsEdit] = useState(false);
  const watchFields = watch("languages");
  let languages  = getValues('languages');

  const getLocation = value => {
    dispatch(additionalData.thunks.getAdditionalLocation({ cityName: value }));
  };

  const onClearOptions = () => {
    dispatch(additionalData.actions.RESET_LOCATION());
  };

  useEffect(() => {
    languages = watchFields;
  }, [watchFields])

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

  const deleteLanguage = (id) => {
    const filteredLanguages = languages.filter(({_id}) => _id !== id);
    setValue('languages', filteredLanguages)
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.content}>
        <div className={styles.upload}>
          <UploadPhoto
            name="avatarPath"
            control={control}
            onChange={onChange}
            loader={changeAvatarStatus === 'pending'}
            title="Add photo"
          />
        </div>
        <div className={styles.info}>
          <div>
            <div className={cn(
              {[styles.hidden]: nameIsEdit},
              'd-flex align-items-center cursor-pointer'
            )}
              onClick={() =>setNameIsEdit(true)}
            >
              <div className="title-sm text-semibold color-grey-600">{getValues('name')}</div>
              <img
                src="/img/profile/icon-edit-name.svg"
                alt=""
                className="ml-2"
              />
            </div>
            <div className={cn(
              {[styles.hidden]: !nameIsEdit}
            )}>
              <TextField
                id="name"
                name="name"
                control={control}
                fullWidth
              />
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className={cn(
              styles.label,
              'color-blue-900 text-md text-semibold'
            )}
            >
              Age:
            </div>
            <div className={cn(
              styles.field,
              'ml-1'
            )}
            >
              <DatePickerField
                name="dob"
                control={control}
                fullWidth
                maxDate={addYears(new Date(), -18)}
              />
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className={cn(
              styles.label,
              'color-blue-900 text-md text-semibold mb-3'
            )}
            >
              Location:
            </div>
            <div className={cn(
              styles.field,
              'ml-1'
            )}>
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
              />
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className={cn(
              styles.label,
              'color-blue-900 text-md text-semibold mb-3'
            )}
            >
              Profession:
            </div>
            <div className={cn(
              styles.field,
              'ml-1'
            )}>
              <SelectField
                name="professional"
                options={additionalDataEnums.professional}
                control={control}
                fullWidth
                placeholder="Profession"
              />
            </div>
          </div>
          <div className="d-flex align-items-center">
            <div className={cn(
              styles.label,
              styles['label--radio'],
              'color-blue-900 text-md text-semibold'
            )}
            >
              Your gender:
            </div>
            <div className="d-flex align-items-center ml-1">
              <RadioField
                name="gender"
                control={control}
                options={additionalDataEnums.gender}
                classes="ml-2"
              />
            </div>
          </div>
          <div className="d-flex align-items-center mt-2">
            <div className={cn(
              styles.label,
              styles['label--radio'],
              'color-blue-900 text-md text-semibold'
            )}
            >
              Your preferences:
            </div>
            <div className={cn(
              styles.status,
              'd-flex align-items-center ml-1'
            )}>
              <RadioField
                name="preference"
                control={control}
                options={additionalDataEnums.preference}
                classes="ml-2"
              />
            </div>
          </div>
          <div className="d-flex align-items-center mt-2">
            <div className={cn(
              styles.label,
              styles['label--radio'],
              'color-blue-900 text-md text-semibold'
            )}
            >
              State:
            </div>
            <div className={cn(
              styles.status,
              'd-flex align-items-center ml-1'
            )}>
              <RadioField
                name="status"
                control={control}
                options={additionalDataEnums.status}
                classes="ml-2"
              />
            </div>
          </div>
          <div className="mt-3">
            <div className="d-flex align-items-center">
              <div className={cn(
                styles.label,
                'color-blue-900 text-md text-semibold mb-2'
              )}
              >
                Languages:
              </div>
              <div className={cn(
                styles.field,
                'ml-2'
              )}>
                <MultiSelectField
                  name="languages"
                  options={additionalDataLang}
                  control={control}
                  fullWidth
                  placeholder="English"
                />
              </div>
            </div>
            {languages.length > 0 && (
              <div className={cn(
                styles.languages,
              )}>
                {languages.map(({label, _id}) => (
                  <div key={_id} className={styles['languages__block']}>
                    <div className="text-md text-semibold color-blue-900">
                      { label }
                    </div>
                    <div className="d-inline-flex ml-1 cursor-pointer"
                      onClick={() => deleteLanguage(_id)}
                    >
                      <IconClose color="#9F9DB2" size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="mt-3">
            <TextAreaField
              label="Bio:"
              name="bio"
              control={control}
              helperFieldText="The maximum number of characters is 200"
              fullWidth
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalAboutMyself;
