import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import Link from "next/link";
import cn from "classnames";
import styles from "./index.module.scss";

LoginPage.layouts = [AuthLayout]
LoginPage.accessMode = 'public'

function LoginPage() {
  return (
    <div className={cn(
      styles.wrap,
      'container'
    )}>
      <form
        className={cn(
          styles.form,
          'form-overlay'
        )}
      >
        <div className="title-xs text-medium text-poppins color-blue-900 mb-5">
          Log in
        </div>
        <TextField
          id="email"
          label="Email"
          name="email"
          fullWidth
        />
        <TextField
          id="password"
          label="Password"
          name="password"
          type="password"
          fullWidth
        />
        <Link href="/reset-password">
          <a className={cn(
            styles.forgot,
            'text-md text-semibold color-blue-900 mb-5 cursor-pointer'
          )}>
            Forgot your password?
          </a>
        </Link>
        <div className="d-flex justify-content-between mb-4">
          <Button
            text="Log in"
            type="submit"
            fullWidth
          />
        </div>
        <div className="d-flex justify-content-between title-xs">
          Don't have an account?
          <Link href="/register">
            <a className="text-semibold color-pink-300">
              Sign up
            </a>
          </Link>
        </div>
      </form>
      <div className={styles.img}>
        <img src="/img/auth/auth-bg.svg" alt=""/>
      </div>
    </div>
  );
}

export default LoginPage;
