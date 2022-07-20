import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import OutsideAlerter from "hooks/ClickOutside";
import Loader from "components/Loader";
import IconSearch from "components/icons/IconSearch";
import IconButton from "components/IconButton";
import IconClose from "components/icons/IconClose";
import cn from "classnames";
import styles from "./index.module.scss";

const AutocompleteComponent = (
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
    textWhite = false,
    loader = false,
    delay = 1000,
    onSubmit,
    prependIcon = false,
    onClearOptions = () => {},
    onHandleSelectedValue = () => {},
    resetOuterState,
    onClearButton = false,
    searchIcon = false,
  }
) => {

  const [dropdownIsVisible, setDropdownIsVisible] = useState(false);
  const [submitTimer, setSubmitTimer] = useState(null);
  const [valueSelected, setValueSelected] = useState('');

    useEffect(() => {
        setValueSelected(value?.value);
        if (value?.value) {
            onHandleSelectedValue(value);
        }
    }, [value._id]);

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

  const handleOnChange = (e) => onInput(e);

    const onClearValueClick = () => {
        setValueSelected('');
        if (resetOuterState) resetOuterState();
    };

  return (
    <div
      className={cn(
        styles.wrap,
        className,
        { [styles['wrap--dark']]: dark },
        { [styles['wrap--text-white']]: textWhite }
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
            'text-md text-normal text-gilroy'
          )}
          value={valueSelected}
          onChange={handleOnChange}
          placeholder={placeholder}
        />
          {valueSelected && onClearButton && (
              <div className={styles.crossIcon}>
                  <IconButton
                      onClick={onClearValueClick}
                  >
                      <IconClose
                          color="rgba(255, 255, 255, .8)"
                          size="md"
                      />
                  </IconButton>
              </div>
          )}
          {!valueSelected && searchIcon && (
              <div className={styles.crossIcon}>
                  <div className="p-1">
                      <IconSearch
                          color="rgba(255, 255, 255, .8)"
                          size="md"
                      />
                  </div>
              </div>
          )}

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
};

const AutocompleteField = (
  {
    label,
    name,
    control,
    options,
    onChange,
    ...rest
  }
) => {
    if (name && control) {
        return (
            <Controller
                name={name}
                control={control}
                render={({field: {onChange, value}, fieldState: {error}}) => (
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

    return <AutocompleteComponent
        options={options}
        onChange={onChange}
        onClearButton={rest.onClearButton}
        searchIcon={rest.searchIcon}
        {...rest} />
};

export default AutocompleteField;
