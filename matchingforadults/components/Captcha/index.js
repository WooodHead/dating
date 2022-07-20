import { Controller } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import cn from "classnames";
import styles from "./index.module.scss";

function ReCaptcha(
  {
    label,
    value,
    onChange,
    error,
    helperText,
    className
  }
) {
  const handleChange = value => {
    console.log("Captcha value:", value);
    onChange(value);
  };

  return (
    <div className={className}>
      <div
        className={cn(
          styles.label,
          'text-md text-semibold'
        )}
      >
        {label}
      </div>
      <div>
        <ReCAPTCHA
          sitekey={process.env.GOOGLE_API_KEY}
          value={value}
          onChange={handleChange}
          theme="dark"
        />
        <div className={styles.error}>
          {error && helperText}
        </div>
      </div>
    </div>
  );
}

function Captcha(
  {
    label,
    name,
    control,
    ...rest
  }
) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <ReCaptcha
          label={label}
          value={value || ''}
          onChange={onChange}
          error={!!error}
          helperText={error?.message ?? ''}
          {...rest}
        />
      )}
    />
  );
}

export default Captcha;