import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/login";
import { useDispatch } from "react-redux";
import { auth } from "store/auth/auth";
import cn from "classnames";
import styles from "./index.module.scss";
import PopupNotification from "components/Popups/PopupNotification";
import { useState } from "react";
import Router from "next/router";

LoginPage.layouts = [AuthLayout]
LoginPage.accessMode = 'public'

function LoginPage() {
  const {control, getValues, handleSubmit} = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const dispatch = useDispatch();

  const [popupNotification, setPopupNotification] = useState(false);

  const onSubmit = async (data) => {
    const {email, ...registerData} = data;
    const formData = {
      ...registerData,
      email: email.toLowerCase(),
    };

    const {payload} = await dispatch(auth.thunks.login(formData));
    if (payload?.statusCode === 403) setPopupNotification(true);
    else if (payload?.statusCode === 418) Router.push({
      pathname: '/account-verified',
      query: {email: getValues('email')}
    });
  }

  return (
    <>
      <div className="container p-sm-0">
        <div className={styles.wrap}>
          <form
            className={cn(
              styles.form,
              'form-overlay mx-auto'
            )}
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="title-xs text-medium text-bitter mb-4">
              Log into your account
            </div>
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
              control={control}
              type="password"
              fullWidth
            />
            <Link href="/reset-password">
              <a className={cn(
                styles.forgot,
                'text-md text-semibold mb-4 cursor-pointer'
              )}>
                Forgot your password?
              </a>
            </Link>
            <div className="d-flex justify-content-between mb-4">
              <Button
                text="Log in"
                type="submit"
                fullWidth
                dark
              />
            </div>
            <div className="d-flex justify-content-between text-bitter title-xs">
              Don't have an account?
              <Link href="/register">
                <a className="text-semibold color-blue-600">
                  Sign up
                </a>
              </Link>
            </div>
          </form>
          <div className={cn(
            styles['text-wrap'],
            'ml-3'
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
          </div>
        </div>
      </div>

      {popupNotification && (
        <PopupNotification onClose={() => setPopupNotification(false)}>
          Your account has been blocked by the administrator, you can use the service in 24 hours
        </PopupNotification>
      )}
    </>
  );
}

export default LoginPage;
