import { useState } from "react";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/register";
import { register } from "store/register/register";
import AuthLayout from "layouts/Auth";
import Button from "components/Button";
import FirstStep from "./FirstStep";
import SecondStep from "./SecondStep";
import cn from "classnames";
import styles from "./index.module.scss";

RegisterPage.layouts = [AuthLayout];
RegisterPage.accessMode = 'public';

function RegisterPage() {
  const dispatch = useDispatch();

  const [stepCounter, setStepCounter] = useState(1);
  const [registerStart, setRegisterStart] = useState(true);

  const { control, handleSubmit, getValues, trigger } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange"
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

  const handleRegisterStart = () => setRegisterStart(false);

  const RegisterStart = () => (
    <div className={styles['register-start']}>
      <h1 className={cn(styles.title, 'text-medium text-poppins')}>
        Let Someone Steal Your Heart and Keep It Forever
      </h1>
      <p className={cn(styles.text, 'title-xs text-italic')}>
        only 2 steps of registration
      </p>
      <div className={styles['register-start__button']}>
        <Button
          fullWidth
          textSize="lg"
          size="md"
          onClick={handleRegisterStart}
          text="Registration Form"
        />
      </div>
    </div>
  );

  const RegisterForm = () => (
    <form
      className={cn(styles.form, 'form-overlay')}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles['form-title']}>
        <div className="title-xs color-blue-900 text-medium text-poppins">Registration form</div>
        <div className={styles['form-title__progress']}>
          <div className={cn(
            styles['form-title__progress-inner'],
            { [styles[`width--100`]]: stepCounter === 2 }
          )} />
        </div>
      </div>
      {stepCounter === 1 ? (
        <FirstStep
          control={control}
          setStepCounter={setStepCounter}
          getValues={getValues}
          trigger={trigger}
        />
      ) : (
        <SecondStep
          control={control}
          trigger={trigger}
        />
      )}
    </form>
  );

  return (
    <div className="container">
      <div className={styles.wrap}>
        {registerStart ? <RegisterStart /> : <RegisterForm />}
        <div className={styles.img}>
          <img src="/img/auth/auth-bg.svg" alt="" />
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
