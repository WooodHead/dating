import { useState } from "react";
import { Controller } from "react-hook-form";
import IconChevronRight from "components/icons/IconChevronRight";
import CheckboxField from "components/Form/CheckboxField";
import OutsideAlerter from "hooks/ClickOutside";
import cn from "classnames";
import styles from "../_shared/index.module.scss";

function MultiSelectComponent(
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

  const onSelect = (option) => {
    const optionIdx = value.findIndex(item => item._id === option._id);
    
    if (optionIdx !== -1) {
      onChange([...value.filter(item => item._id !== value[optionIdx]._id)]);
    } else {
      onChange([...value, option]);
    }
  };
  
  const isActive = (option) => {
    return value.some(item => item._id === option._id);
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
            'text-md text-normal text-gilroy'
          )}
          value={value.map((item, key) => key ? ' ' + item.value : item.value)}
          placeholder={placeholder}
          onClick={() => setDropdownIsVisible(true)}
          readOnly
        />
        <IconChevronRight
          color="#54544B"
          size="xs"
          className={cn(
            styles.chevron,
            'rotate-90',
            { ['rotate-270']: dropdownIsVisible }
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
                    { [styles['dropdown__row--active']]: isActive(option) },
                    'text-gilroy'
                  )}
                  onClick={(e) => {
                    e.preventDefault();
                    onSelect(option);
                  }}
                >
                  <CheckboxField
                    name={option.value}
                    className="mr-2"
                    value={isActive(option)}
                  />
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

function MultiSelectField(
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
        <MultiSelectComponent
          label={label}
          name={name}
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

export default MultiSelectField;
