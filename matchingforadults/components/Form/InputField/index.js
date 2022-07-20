import { useState } from "react";
import { Controller } from "react-hook-form";
import IconWarningCircle from "components/icons/IconWarningCircle";
import IconEyePassword from "components/icons/IconEyePassword";
import IconEyePasswordOff from "components/icons/IconEyePasswordOff";
import IconButton from "components/IconButton";
import cn from "classnames";
import styles from './index.module.scss';

function InputFieldComponent(
  {
    label,
    name,
    type = 'text',
    fullWidth = false,
    error = false,
    dark = false,
    value,
    onChange = () => {},
    helperText,
    placeholder
  }
) {
  const [fieldType, setFieldType] = useState(type);
  
  const handlePassword = () => {
    const type = fieldType === 'password' ? 'text' : 'password';
    setFieldType(type);
  };
  
  return (
    <div
      className={cn(
        styles.wrap,
        { [styles['wrap--full-width']]: fullWidth },
        { [styles['wrap--dark']]: dark }
      )}
    >
      {label && (
        <label
          htmlFor={name}
          className={cn(
            styles.label,
            'text-semibold'
          )}
        >
          {label}
        </label>
      )}
      <div className={styles.input}>
        <input
          type={fieldType}
          className={cn(
            styles.field,
            { [styles['field--error']]: error },
            { [styles['field--filled']]: !!value.length }
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
        {(type === 'password' && !error) && (
          <IconButton
            className={cn(
              styles.icon,
              styles['icon--password']
            )}
            onClick={handlePassword}
          >
            {fieldType === 'password' ?
              <IconEyePasswordOff color={dark ? '#FFFFFF' : '#323B52'}/>
              :
              <IconEyePassword color={dark ? '#FFFFFF' : '#323B52'}/>}
          </IconButton>
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
