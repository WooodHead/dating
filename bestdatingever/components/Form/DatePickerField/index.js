import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { CalendarContainer } from "react-datepicker";
import { getYear, getMonth } from "date-fns";
import IconCalendar from "components/icons/IconCalendar";
import IconChevronLeft from "components/icons/IconChevronLeft";
import IconChevronRight from "components/icons/IconChevronRight";
import { useMemo, useState } from "react";
import IconWarningCircle from "components/icons/IconWarningCircle";
import cn from "classnames";
import styles from "./index.module.scss";

function DatePickerComponent(
  {
    value,
    onChange,
    name,
    error,
    helperText,
    label,
    fullWidth,
    ...rest
  }
) {
  const renderCustomHeader = (
    {
      date,
      decreaseYear,
      increaseYear,
      decreaseMonth,
      increaseMonth,
    }
  ) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    return (
      <div className="react-datepicker__head">
        <div className="d-flex align-items-center justify-content-center mb-1">
          <button
            type="button"
            className="react-datepicker__head-btn react-datepicker__head-btn--year"
            onClick={decreaseYear}
          >
            <IconChevronLeft size="xs"/>
          </button>
          <div className="react-datepicker__head-year-field">
            {getYear(date)}
          </div>
          <button
            type="button"
            className="react-datepicker__head-btn react-datepicker__head-btn--year"
            onClick={increaseYear}
          >
            <IconChevronRight size="xs"/>
          </button>
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="button"
            className="react-datepicker__head-btn"
            onClick={decreaseMonth}
          >
            <IconChevronLeft/>
          </button>
          <div className="title-xs mx-2 color-white">
            {months[getMonth(date)]}
          </div>
          <button
            type="button"
            className="react-datepicker__head-btn"
            onClick={increaseMonth}
          >
            <IconChevronRight/>
          </button>
        </div>
      </div>
    );
  }

  const renderDayContents = (day, date) => (
    <div className="react-datepicker__day-number">
      {day}
    </div>
  );

  const MyContainer = ({ className, children }) => {
    return (
      <CalendarContainer className={className}>
        {children}
      </CalendarContainer>
    );
  };
  
  const [fieldInFocus, setFieldInFocus] = useState(false);
  
  const fieldIsActive = useMemo(() => {
    return !!value;
  }, [value]);

  return (
    <div className={styles.wrap}>
      <label
        htmlFor={name}
        className={cn(
          styles.label,
          { [styles['label--active']]: fieldInFocus || fieldIsActive }
        )}>
        {label}
      </label>
      <div className={styles.input}>
        <DatePicker
          id={name}
          className={cn(
            styles.field,
            { [styles['field--full-width']]: fullWidth },
            { [styles['field--error']]: error },
            { [styles['field--filled']]: fieldIsActive },
            'text-md text-normal'
          )}
          autoComplete="off"
          showPopperArrow={false}
          dateFormat="dd-MM-yyyy"
          selected={value}
          onChange={(date) => onChange(date)}
          onFocus={() => setFieldInFocus(true)}
          onBlur={() => setFieldInFocus(false)}
          showTimeSelect={false}
          renderCustomHeader={renderCustomHeader}
          renderDayContents={renderDayContents}
          calendarContainer={MyContainer}
          {...rest}
        />
        <div className={styles.icon}>
          {!error ? <IconCalendar color="#EBEBEB" /> : <IconWarningCircle/>}
        </div>
      </div>
      <div className={cn(
        styles.error,
        'text-default'
      )}>
        {error && helperText}
      </div>
    </div>
  );
}

function DatePickerField(
  {
    label,
    name,
    control,
    ...rest
  }
) {
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <DatePickerComponent
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

export default DatePickerField;
