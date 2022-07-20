import { useMemo } from "react";
import { useSelector } from "react-redux";
import { register } from "store/register/register";
import TextField from "components/Form/TextField";
import CheckboxField from "components/Form/CheckboxField";
import Button from "components/Button";
import Link from "next/link";

const SecondStep = ({ control }) => {
  const registerStatus = useSelector(register.selectors.registerStatus);
  const isRegisterStatusPending = useMemo(() => registerStatus === 'pending', [registerStatus]);

  return (
    <>
      <TextField
        id="username"
        label="Username"
        name="name"
        control={control}
        fullWidth
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
      <div className="mb-4">
        <div className="d-flex align-items-start mb-2">
          <div className="mt-1">
            <CheckboxField
              name="termsAndPrivacy"
              control={control}
            />
          </div>
          <span className="text-md ml-1 ">
            I agree to Platforms &nbsp;
            <Link href="/terms-of-use">
              <a className="text-underline-link">Terms of Use</a>
            </Link>
            &nbsp;
            and
            &nbsp;
            <Link href="/privacy-policy">
              <a className="text-underline-link">Privacy Policy</a>
            </Link>
          </span>
        </div>
      </div>
      <Button
        type="submit"
        text="Sign up"
        textSize="lg"
        loader={isRegisterStatusPending}
        fullWidth
      />
    </>
  )
};

export default SecondStep;