import { useState } from "react";
import { Controller } from "react-hook-form";
import IconChevron from "components/icons/IconChevron";
import OutsideAlerter from "hooks/ClickOutside";
import cn from "classnames";
import styles from "../_shared/index.module.scss";

function SelectComponent(
  {
    label,
    value,
    onChange,
    error = false,
    helperText,
    options = [],
    fullWidth = false,
    size,
    className,
    placeholder,
    dark = false,
  }
) {
  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);

  const onSelect = option => {
    onChange(option.value);
    setDropdownIsVisible(false);
  };

  return (
    <div
      className={cn(
        styles.wrap,
        className,
        { [styles['wrap--dark']]: dark },
        { [styles['wrap--full-width']]: fullWidth },
      )}
    >
      {label && (
        <label
          className={cn(
            styles.label,
            'text-md text-semibold'
          )}
        >
          {label}
        </label>
      )}
      <div className={cn(
        styles.select,
        { [styles['select--full-width']]: fullWidth },
        { [styles[`select--${size}`]]: size },
      )}>
        <input
          type="text"
          className={cn(
            styles.field,
            { [styles['field--error']]: error },
            'text-md text-normal'
          )}
          value={value}
          placeholder={placeholder}
          onClick={() => setDropdownIsVisible(true)}
          readOnly
        />
        <IconChevron
          className={cn(
            styles.chevron,
            { ['rotate-180']: dropdownIsVisible }
          )}
        />

        {/* Dropdown */}
        {dropdownIsVisible && (
          <OutsideAlerter
            close={() => setDropdownIsVisible(false)}
          >
            <div className={cn(styles.dropdown, 'custom-scroll')}>
              {options.map(option => (
                <div
                  key={option.value}
                  className={cn(
                    styles['dropdown__row'],
                    { [styles['dropdown__row--active']]: option.value === value }
                  )}
                  onClick={() => onSelect(option)}
                >
                  {option.label}
                </div>
              ))}
              {!options.length && (
                <div className={styles['dropdown__empty']}>
                  List is empty
                </div>
              )}
            </div>
          </OutsideAlerter>
        )}
      </div>
      <div className={styles.error}>
        {error && helperText}
      </div>
    </div>
  );
}

function SelectField(
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
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <SelectComponent
          label={label}
          value={value || ''}
          onChange={onChange}
          error={!!error}
          helperText={error?.message ?? ''}
          options={options}
          {...rest}
        />
      )}
    />
  );
}

export default SelectField;
