import { Controller } from "react-hook-form";
import cn from "classnames";
import styles from "./index.module.scss";

function RadioFieldComponent(
  {
    value,
    onChange,
    error,
    name,
    helperText,
    options,
    classes,
    theme = 'cyan'
  }
) {
  return (
    options ? options.map(({ label, option }) => (
      <label
        key={option}
        htmlFor={name + '-' + option}
        className={cn(
          'd-flex align-items-start cursor-pointer',
          classes,
          styles[`wrap--${theme}`]
        )}
      >
        <input
          id={name + '-' + option}
          name={name}
          type="radio"
          value={option}
          onChange={onChange}
          checked={option === value}
          className={styles.field}
        />
        <div className={styles.radio}/>
        <div className="ml-1">{label}</div>
      </label>
    )) : null
  );
}

function RadioField(
  {
    label,
    name,
    control,
    options,
    ...rest
  }
) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <RadioFieldComponent
          label={label}
          value={value || ''}
          onChange={onChange}
          error={!!error}
          name={name}
          options={options}
          helperText={error?.message ?? ''}
          {...rest}
        />
      )}
    />
  );
}

export default RadioField;
