import { Controller } from "react-hook-form";
import IconWarningCircle from "components/icons/IconWarningCircle";
import cn from "classnames";
import styles from './index.module.scss';

function InputFieldComponent(
  {
    label,
    name,
    type = 'text',
    fullWidth = false,
    error = false,
    value,
    onChange = () => {},
    helperText,
    placeholder,
    outline,
    size,
  }
) {
  return (
    <div
      className={cn(
        styles.wrap,
        { [styles['wrap--full-width']]: fullWidth },
        { [styles[`wrap--${size}`]]: size },
      )}
    >
      {label && (
        <label
          htmlFor={name}
          className={cn(
            styles.label,
            'text-md text-semibold pl-2'
          )}
        >
          {label}
        </label>
      )}
      <div className={styles.input}>
        <input
          id={name}
          type={type}
          className={cn(
            styles.field,
            { [styles['field--error']]: error },
            { [styles['field--outline']]: outline },
            'text-md text-normal'
          )}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        {error && (
          <div className={styles.icon}>
            <IconWarningCircle/>
          </div>
        )}
      </div>
      <div className={styles.error}>
        {error && helperText}
      </div>
    </div>
  );
}

function InputField(
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
        <InputFieldComponent
          label={label}
          value={value || ''}
          name={name}
          onChange={onChange}
          error={!!error}
          helperText={error?.message ?? ''}
          {...rest}
        />
      )}
    />
  );
}

export default InputField;
