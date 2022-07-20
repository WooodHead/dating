import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import RadioField from "components/Form/RadioField";
import CheckboxField from "components/Form/CheckboxField";
import DatePickerField from "components/Form/DatePickerField";
import AutocompleteField from "components/Form/AutocompleteField";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/register";
import { format, addYears } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { register } from "store/register/register";
import { additionalData } from "store/additional/additionalData";
import IconArrowBack from "components/icons/IconArrowBack";
import { preferences } from "utils/constants";
import cn from "classnames";
import styles from "./index.module.scss";

RegisterPage.layouts = [AuthLayout]
RegisterPage.accessMode = 'public'

function RegisterPage() {
  const dispatch = useDispatch();
  const registerStatus = useSelector(register.selectors.registerStatus);
  const additionalDataLocation = useSelector(additionalData.selectors.formattedLocation);
  const locationStatus = useSelector(additionalData.selectors.locationStatus);

  const genderOptions = [
    { label: "Man", option: "Male" },
    { label: "Woman", option: "Female" }
  ];
  
  const preferenceOptions = [
    { label: "Men", option: preferences.MALE },
    { label: "Women", option: preferences.FEMALE },
    { label: "All", option: preferences.ALL },
  ];

  const { control, handleSubmit } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const onSubmit = data => {
    const { privacy, terms, dob, email, location, ...registerData} = data;
    const formData = {
      ...registerData,
      email: email.toLowerCase(),
      dob: format(Date.parse(dob), "dd-MM-yyyy"),
      location: location._id,
    };
    dispatch(register.thunks.register(formData));
  };

  const getLocation = value => {
    dispatch(additionalData.thunks.getAdditionalLocation({ cityName: value }));
  };

  const onClearOptions = () => {
    dispatch(additionalData.actions.RESET_LOCATION());
  };

  return (
    <div className="container p-md-0">
      <div className={styles.wrap}>
        <form
            className={cn(
              styles.form,
              'form-overlay wider my-lg-3 my-md-0'
            )}
            onSubmit={handleSubmit(onSubmit)}
        >
          <div className="title-xs text-medium text-bitter mb-2">Registration Form</div>
          <div className={cn(styles['radio-group-container'],
              'd-flex justify-content-between flex-row'
          )}>
            <div className={cn(styles['radio-input-group'])}>
              <div className="text-md text-semibold mb-2">Your gender</div>
              <div className="d-flex align-items-center mb-2">
                <RadioField
                    name="gender"
                    control={control}
                    options={genderOptions}
                    classes="mr-4"
                    color="blue"
                />
              </div>
            </div>
            <div className={cn(styles['radio-input-group'])}>
              <div className="text-md text-semibold mb-2">Your preferences</div>
              <div className="d-flex align-items-center mb-2">
                <RadioField
                    name="preference"
                    control={control}
                    options={preferenceOptions}
                    classes="mr-4"
                    color="blue"
                />
              </div>
            </div>
          </div>

          <div className={cn(styles['input-group-container'],
              'd-flex justify-content-between flex-row'
          )}>
            <div className={cn(styles['input-group'],
                'd-flex flex-column'
            )}>
              <DatePickerField
                  label="Date of birth"
                  name="dob"
                  control={control}
                  fullWidth
                  maxDate={addYears(new Date(), -18)}
              />
              <TextField
                  id="email"
                  label="Email"
                  name="email"
                  control={control}
                  fullWidth
              />
              <TextField
                  id="password"
                  label="Password"
                  name="password"
                  type="password"
                  control={control}
                  fullWidth
              />
            </div>
            <div className={cn(styles['input-group'],
                'd-flex flex-column'
            )}>
              <TextField
                  id="username"
                  label="Username"
                  name="name"
                  control={control}
                  fullWidth
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
                  textWhite
                  prependIcon
                  placeholder="Amsterdam"
                  loader={locationStatus === 'pending'}
                  onSubmit={getLocation}
                  onClearOptions={onClearOptions}
              />
            </div>
          </div>

          <div className="mb-4">
            <div className="d-flex align-items-center mb-2">
              <CheckboxField
                  name="terms"
                  control={control}
              />
              <span className="color-grey-600 ml-2">
                I confirm that I am over 18 years old and have read the &nbsp;
                <Link href="/terms-of-use">
                  <a className="text-underline-link color-pink-500">Terms of Use</a>
                </Link>
              </span>
            </div>
            <div className="d-flex align-items-center">
              <CheckboxField
                  name="privacy"
                  control={control}
              />
              <span className="color-grey-600 ml-2">
                By making this checkbox I agree to lovehostages.com &nbsp;
                <Link href="/privacy-policy">
                  <a className="text-underline-link color-pink-500">Privacy Policy</a>
                </Link>
              </span>
            </div>
          </div>
          <div className={cn(styles['register-button-container'])}>
            <Button
                type="submit"
                text="Free Registration"
                loader={registerStatus === 'pending'}
                fullWidth
                dark
            />
          </div>
        </form>

        <div className={cn(
          styles['text-wrap'],
          'ml-3 ml-lg-0 pt-lg-3'
        )}>
          <h1
            className={cn(
              styles.title,
              'text-medium text-bitter'
            )}
          >
            Let Someone Steal Your Heart and Keep It Forever
          </h1>
          <p
            className={cn(
              styles.text,
              'title-xs'
            )}
          >
            What is love? Well, when a person belly
            makes him feel sick and at the
            same time so light.
          </p>
          <div className={cn(
            styles['mobile-text'],
            'color-white text-lg text-bold d-flex align-items-center flex-column text-bitter'
          )}>
            <p>Register below</p>
            <div className={styles['mobile-text__icon']}><IconArrowBack color="#ffffff" className="rotate-270"/></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
