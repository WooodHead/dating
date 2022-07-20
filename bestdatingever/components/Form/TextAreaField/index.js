import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import cn from "classnames";
import styles from './index.module.scss';

function TextAreaFieldComponent(
  {
    id,
    label,
    name,
    fullWidth = false,
    error = false,
    dark = false,
    value,
    onChange,
    helperText,
    helperFieldText,
    sizeHeight,
    outline,
    placeholder,
  }
) {
  const [fieldInFocus, setFieldInFocus] = useState(false);

  const fieldIsActive = useMemo(() => {
    return value.length > 0;
  }, [value]);

  return (
    <div
      className={cn(
        styles.wrap,
        { [styles['wrap--dark']]: dark }
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          styles.label,
          { [styles['label--active']]: fieldInFocus || fieldIsActive }
        )}
      >
        {label}
      </label>
      <div className={styles.input}>
        <textarea
          id={name}
          className={cn(
            styles.field,
            { [styles['field--full-width']]: fullWidth },
            { [styles['field--error']]: error },
            { [styles[`field--${sizeHeight}`]]: sizeHeight },
            { [styles[`field--outline`]]: outline },
            { [styles[`field--with-label`]]: label },
            'text-md text-normal'
          )}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setFieldInFocus(true)}
          onBlur={() => setFieldInFocus(false)}
        />
        {/*{error && (
          <div className={styles.icon}>
            <IconWarningCircle/>
          </div>
        )}*/}
      </div>
      {helperFieldText && (
        <div className={cn(
          styles['helper-text'],
          'text-xs'
        )}>
          {helperFieldText}
        </div>
      )}
      <div className={styles.error}>
        {error && helperText}
      </div>
    </div>
  );
}

function TextAreaField(
  {
    label,
    name,
    control,
    ...rest
  }
) {
  if (name && control) {
    return (
      <Controller
        name={name}
        control={control}
        render={({
          field: {
            onChange,
            value
          },
          fieldState: { error }
        }) => (
          <TextAreaFieldComponent
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
    <TextAreaFieldComponent
      label={label}
      name={name}
      {...rest}
    />
  );
}

export default TextAreaField;
