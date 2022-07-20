import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import OutsideAlerter from "hooks/ClickOutside";
import Loader from "components/Loader";
import cn from "classnames";
import styles from "./index.module.scss";

function AutocompleteComponent(
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
    loader = false,
    noArrows = false,
    delay = 1000,
    onSubmit,
    prependIcon = false,
    onClearOptions = () => {},
  }
) {
  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);
  const [submitTimer, setSubmitTimer] = useState(null);
  const [valueSelected, setValueSelected] = useState('');

  useEffect(() => {
    setValueSelected(value.value)
  }, [value]);

  const onCloseDropdown = () => {
    setDropdownIsVisible(false);
    onClearOptions();
  };

  const onSelect = option => {
    onChange(option);
    onCloseDropdown();
  };

  const onInput = (e) => {
    const value = e.target.value;
    setValueSelected(value);
    clearInterval(submitTimer);
    setSubmitTimer(setTimeout(() => {
      setDropdownIsVisible(true);
      if (value.length >= 3) onSubmit(value);
      if (value.length === 0) {
        onChange('');
        setValueSelected('');
      }
    }, delay));
  };

  return (
    <div
      className={cn(
        styles.wrap,
        className,
        { [styles['wrap--dark']]: dark }
      )}
    >
      {label && (
        <label
          className={cn(
            styles.label,
            'text-md'
          )}
        >
          {label}
        </label>
      )}
      <div className={cn(
        styles.autocomplete,
        { [styles['autocomplete--full-width']]: fullWidth },
        { [styles[`autocomplete--${size}`]]: size },
      )}>
        {prependIcon && (
          <div className={styles['field__prepend-icon']}>
            <img
              src={value.path || '/img/form/icon-flag-default.svg'}
              alt=""
              className="img-fit-cover"
            />
          </div>
        )}
        <input
          type="text"
          className={cn(
            styles.field,
            { [styles['field--error']]: error },
            { [styles['field--prepend-icon']]: prependIcon },
            { [styles['field--no-arrows']]: noArrows },
              'text-md text-normal text-gilroy'
          )}
          value={valueSelected}
          onChange={(e) => onInput(e)}
          placeholder={placeholder}
        />

        {/* Dropdown */}
        {dropdownIsVisible && (
          <OutsideAlerter close={onCloseDropdown}>
            <div className={cn(styles.dropdown, 'custom-scroll')}>
              {options.map(option => (
                <div
                  key={option.value + '-' + option._id}
                  className={cn(
                    styles['dropdown__row'],
                    { [styles['dropdown__row--active']]: option._id === value._id },
                  )}
                  onClick={() => onSelect(option)}
                >
                  {option.path && (
                    <div className={styles['dropdown__prepend-icon']}>
                      <img
                        src={option.path}
                        alt=""
                        className="img-fit-cover"
                      />
                    </div>
                  )}
                  {option.label}
                </div>
              ))}
              {(!loader && !options.length) && (
                <div className={styles['dropdown__empty']}>
                  List is empty
                </div>
              )}
              {loader && (
                <div className={cn(
                  styles['dropdown__empty'],
                  'd-flex align-items-center justify-content-center'
                )}>
                  <Loader size="sm"/>
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

function AutocompleteField(
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
        <AutocompleteComponent
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

export default AutocompleteField;
