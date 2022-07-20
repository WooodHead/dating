import { Controller } from "react-hook-form";
import IconCheck from "components/icons/IconCheck";
import cn from "classnames";
import styles from "./index.module.scss";

function CheckboxComponent(
  {
    value,
    onChange = () => {},
    error,
    name,
    checkmarkColor = '#FFFFFF',
    className,
    propertyOption,
    dark,
    switcher = false,
  }
) {
  return (
    <>
      {!switcher ? (
          <div className={cn(
            styles['checkbox__wrap'],
            { [styles['checkbox--dark']]: dark },
            className
          )}>
            <input
              type="checkbox"
              id={name}
              onChange={(e) => onChange(e.target.checked, propertyOption)}
              checked={value}
              className={cn(
                styles.checkbox,
                { [styles['checkbox--required']]: error }
              )}
            />
            <label
              htmlFor={name}
              className="d-flex"
            >
              <IconCheck
                color={checkmarkColor}
                size="xs"
                className={styles.checkmark}
              />
            </label>
          </div>
        ) : (
          <label className={styles.switch}>
            <input
              type="checkbox"
              id={name}
              onChange={(e) => onChange(e.target.checked, propertyOption)}
              checked={value}
            />
            <span className={cn(
              styles.slider,
              styles.round
            )} />
          </label>
        )}
    </>
  );
}

function CheckboxField(
  {
    label,
    name,
    control,
    defaultValue = false,
    ...rest
  }
) {
  if (name && control) {
    return (
      <Controller
        name={name}
        control={control}
        defaultValue={true}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <CheckboxComponent
            label={label}
            value={value || ''}
            onChange={onChange}
            error={!!error}
            name={name}
            helperText={error?.message ?? ''}
            {...rest}
          />
        )}
      />
    );
  }

  return <CheckboxComponent name={name} {...rest}/>
}

export default CheckboxField;
