import { Controller } from "react-hook-form";
import cn from "classnames";
import styles from "./index.module.scss";

function SwitcherComponent(
  {
    value,
    onChange = () => {},
    error,
    name,
    className,
    propertyOption,
    dark
  }
) {
  return (
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
        <div
          className={styles.checkmark}
        />
      </label>
    </div>
  );
}

function SwitcherField(
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
          <SwitcherComponent
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

  return <SwitcherComponent name={name} {...rest}/>
}

export default SwitcherField;
