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
import { preferences } from "utils/constants";
import { additionalData } from "store/additional/additionalData";
import RegisterOverlay from "components/RegisterPage/RegisterOverlay";
import { useState } from "react";
import cn from "classnames";
import styles from "./index.module.scss";

RegisterPage.layouts = [AuthLayout]
RegisterPage.accessMode = 'public'
RegisterPage.title = 'Sign up'

function RegisterPage() {
  const dispatch = useDispatch();
  const [formIsVisible, setFormIsVisible] = useState(false);
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
    <>
      <RegisterOverlay onRegister={() => setFormIsVisible(true)}/>
  
      {formIsVisible && (
        <div className={styles.wrap}>
          <form
            className={cn(
                styles.form,
                'form-overlay wider my-lg-3 my-md-0'
            )}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="title-xs text-new-york text-center mb-3">Registration</div>

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
                      theme="white"
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
                      theme="white"
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
                      dark
                      maxDate={addYears(new Date(), -18)}
                  />
                  <TextField
                      id="email"
                      label="Email"
                      name="email"
                      control={control}
                      fullWidth
                      dark
                  />
                  <TextField
                      id="password"
                      label="Password"
                      name="password"
                      type="password"
                      control={control}
                      fullWidth
                      dark
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
                      dark
                  />
                  <TextField
                      id="phone"
                      label="Phone (optional)"
                      name="phone"
                      type="number"
                      control={control}
                      fullWidth
                      noArrows
                      dark
                  />
                  <AutocompleteField
                      name="location"
                      options={additionalDataLocation}
                      control={control}
                      fullWidth
                      dark
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
                  white
                />
                <span className="color-grey-500 ml-2">
                I confirm that I am over 18 years old and have read the &nbsp;
                  <Link href="/terms-of-use">
                  <a className="text-underline-link">Terms of Use</a>
                </Link>
              </span>
              </div>
              <div className="d-flex align-items-center">
                <CheckboxField
                  name="privacy"
                  control={control}
                  white
                />
                <span className="ml-2">
                By making this checkbox I agree to bestdatingever.com &nbsp;
                  <Link href="/privacy-policy">
                  <a className="text-underline-link">Privacy Policy</a>
                </Link>
              </span>
              </div>
            </div>
            <div className={cn(styles['register-button-container'])}>
              <Button
                type="submit"
                theme="gradient"
                size="lg"
                loader={registerStatus === 'pending'}
                fullWidth
              >
                Free Registration
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default RegisterPage;
