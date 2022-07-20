import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import { CalendarContainer } from "react-datepicker";
import { getYear, getMonth } from "date-fns";
import IconCalendar from "components/icons/IconCalendar";
import IconChevronLeft from "components/icons/IconChevronLeft";
import IconChevronRight from "components/icons/IconChevronRight";
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
    dark = false,
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
      <CalendarContainer className={cn(
        className,
        { ['react-datepicker--dark']: dark }
      )}>
        {children}
      </CalendarContainer>
    );
  };

  return (
    <div className={cn(
      styles.wrap,
      { [styles['wrap--dark']]: dark }
    )}>
      <label
        htmlFor={name}
        className={cn(
          styles.label,
          'text-md'
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
            'text-md text-normal text-gilroy'
          )}
          autoComplete="off"
          showPopperArrow={false}
          placeholderText="dd-mm-yyyy"
          dateFormat="dd-MM-yyyy"
          selected={value}
          onChange={(date) => onChange(date)}
          showTimeSelect={false}
          renderCustomHeader={renderCustomHeader}
          renderDayContents={renderDayContents}
          calendarContainer={MyContainer}
          {...rest}
        />
        <div className={styles.icon}>
          <IconCalendar color="#EBEBEB"/>
        </div>
      </div>
      <div className={styles.error}>
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
