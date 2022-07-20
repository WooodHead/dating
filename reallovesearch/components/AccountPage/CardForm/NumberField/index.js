import { useState } from "react";
import { Controller } from "react-hook-form";
import valid from "card-validator";
import NumberFormat from "react-number-format";
import IconWarningCircle from "components/icons/IconWarningCircle";
import CreditCardIcon from "../CreditCardIcon";
import cn from "classnames";
import styles from "./index.module.scss";

function NumberFieldComponent(
  {
    label,
    fullWidth = false,
    name,
    value,
    onChange = () => {
    },
    error = false,
    helperText,
    dark = false,
    className,
    cardNumber = false,
    setCvvFormat = () => {
    },
    setCardNumberFormat = () => {
    },
    ...rest
  }
) {
  const [cardType, setCartType] = useState('');

  const onCardChange = (value) => {
    setCartType('');

    if (value.length < 2) return;

    const info = valid.number(value);

    if (info.card) {
      setCartType(info.card.type);
      setCvvFormat(info.card.code);
      setCardNumberFormat({
        gaps: info.card.gaps,
        lengths: info.card.lengths,
      });
    }
  };

  const onValueChange = (value) => {
    if (name === 'number') {
      onCardChange(value);
    }
  };

  return (
    <div
      className={cn(
        className,
        styles.wrap,
        { [styles['wrap--full-width']]: fullWidth },
        { [styles['wrap--dark']]: dark },
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

      <div className={styles.input}>
        <NumberFormat
          value={value}
          onValueChange={(values) => {
            const { value } = values;
            onValueChange(value);
            onChange(value);
            return value;
          }}
          className={cn(
            styles.field,
            { [styles['field--error']]: error },
            'text-md'
          )}
          {...rest}
        />

        {cardNumber && (
          <div className={styles.icon}>
            {cardType && <CreditCardIcon brand={cardType} width={50} />}
          </div>
        )}

        {error && (
          <div className={styles.icon}>
            <IconWarningCircle />
          </div>
        )}
      </div>
      <div className={styles.error}>
        {error && helperText}
      </div>
    </div>
  );
}

export default function NumberInput(
  {
    label,
    name,
    control,
    onChange,
    ...rest
  }
) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, name }, fieldState: { error } }) => (
        <NumberFieldComponent
          name={name}
          label={label}
          value={value}
          onChange={onChange}
          error={!!error}
          helperText={error?.message ?? ''}
          {...rest}
        />
      )}
    />
  );
}
