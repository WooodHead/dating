import { Controller } from "react-hook-form";
import { useRef, useState } from "react";
import cn from "classnames";
import styles from './index.module.scss';

function TextAreaFieldComponent(
  {
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
    placeholder,
    outline,
    defaultAreaHeight = 48,
    maxAreaHeight = 200,
  }
) {
  const [areaHeight, setAreaHeight] = useState(defaultAreaHeight);
  const areaRef = useRef();

  const autoGrow = (value) => {
    if(!value.target.value) {
      setAreaHeight(defaultAreaHeight)
    } else {
      if (areaRef.current.scrollHeight > defaultAreaHeight) setAreaHeight(areaRef.current.scrollHeight);
    }
    onChange(value)
  }

  return (
    <div
      className={cn(
        styles.wrap,
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
        <textarea
          id={name}
          ref={areaRef}
          className={cn(
            styles.field,
            { [styles['field--full-width']]: fullWidth },
            { [styles['field--error']]: error },
            { [styles[`field--${sizeHeight}`]]: sizeHeight },
            { [styles['field--filled']]: !!value.length },
            { [styles['field--overflow']]: areaHeight < maxAreaHeight },
            { [styles['field--outline']]: outline },
            { 'text-md': dark }
          )}
          value={value}
          onChange={autoGrow}
          placeholder={placeholder}
          style={{height: areaHeight}}
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
        render={({ field: { onChange, value }, fieldState: { error } }) => (
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
