import { useState } from "react";
import { Controller } from "react-hook-form";
import IconWarningCircle from "components/icons/IconWarningCircle";
import IconEyePassword from "components/icons/IconEyePassword";
import IconEyePasswordOff from "components/icons/IconEyePasswordOff";
import IconButton from "components/IconButton";
import cn from "classnames";
import styles from './index.module.scss';

function TextFieldComponent(
  {
    id,
    label,
    type = 'text',
    fullWidth = false,
    error = false,
    dark = false,
    noArrows = false,
    value,
    onChange = () => {},
    helperText,
    placeholder,
    iconFront,
    className,
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
        { [styles['wrap--dark']]: dark },
        className
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          styles.label,
          'text-md text-semibold'
        )}
      >
        {label}
      </label>
      <div className={styles.input}>
        <div>
          <input
            id={id}
            type={fieldType}
            className={cn(
              styles.field,
              { [styles['field--error']]: error },
              { [styles['field--no-arrows']]: noArrows },
              'text-md text-normal text-gilroy'
            )}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
          />
          <div className={styles['icon-front']}>
            {iconFront}
          </div>
        </div>

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

function TextField(
  {
    label,
    name,
    control,
    ...rest
  }
) {
  if(name && control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextFieldComponent
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
  return (
    <TextFieldComponent
      label={label}
      name={name}
      {...rest}
    />
  );
}

export default TextField;
