import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/account/buying-subscription";
import { buyingSubscription } from "store/user/subscription/buying";
import { subscriptionPlans } from "utils/constants";
import valid from "card-validator";
import MainLayout from "layouts/Main";
import MySubscription from "layouts/MySubscription";
import SubscriptionPlan from "components/AccountPage/SubscriptionPlan";
import Button from "components/Button";
import NumberField from "components/AccountPage/CardForm/NumberField";
import TextField from "components/Form/TextField";
import cn from "classnames";
import styles from "./index.module.scss";

BuyingSubscription.layouts = [MainLayout, MySubscription];

function BuyingSubscription() {
  const dispatch = useDispatch();
  const planId = useSelector(buyingSubscription.selectors.planId);
  const currentPlan = subscriptionPlans.find(plan => plan._id === planId);

  const { control, handleSubmit, watch, setValue, setError } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });

  const watchName = watch("name");

  useEffect(() => {
    setValue('name', watchName.toUpperCase())
  }, [watchName])

  const [cvvFormat, setCvvFormat] = useState({ name: 'CVV', size: 3 });
  const [cardNumberFormat, setCardNumberFormat] = useState({
    gaps: [4, 8, 12], // default mastercard
    lengths: [16],
  });

  const _cardNumberFormat = useMemo(() => {
    const arrSymbols = [];
    const lastElLengths = cardNumberFormat.lengths[cardNumberFormat.lengths.length - 1];

    for (let i = 1; i <= lastElLengths; i++) {
      if (cardNumberFormat.gaps.includes(i)) {
        arrSymbols.push('#');
        arrSymbols.push(' ');
      } else {
        arrSymbols.push('#');
      }
    }

    return arrSymbols.join('');
  }, [cardNumberFormat]);

  const onSubmit = (values) => {
    const number = valid.number(values.number);
    const expiry = valid.expirationDate(values.expiry);
    const cvv = valid.cvv(values.cvv);

    if (!number.isValid) setError('number', { type: 'manual', message: 'Invalid card number' });
    if (!expiry.isValid) setError('expiry', { type: 'manual', message: 'Invalid expiry date' });
    if (!cvv.isValid) setError('cvv', { type: 'manual', message: 'Invalid cvv number' });

    if (!number.isValid || !expiry.isValid || !cvv.isValid) return;

    console.log('%c=> onSubmit', 'color: orange', values);
    // dispatch();
  };

  return (
    <>
      <div className="title-md text-semibold text-center text-gilroy mb-2 mt-3">
        Buying a subscription
      </div>
      <div className={cn(styles.subtitle, 'text-md text-semibold text-center')}>
        Use a premium subscription to use all the platform's features
      </div>
      <div className={styles.wrap}>
        <div className={styles.plan}>
          <SubscriptionPlan
            key={currentPlan._id}
            plan={currentPlan}
            isActionVisible={false}
          />
        </div>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className="text-xl text-semibold text-gilroy mt-4 mb-2">
            Card information
          </div>
          <TextField
            id="name"
            label="User Name of card"
            name="name"
            control={control}
            placeholder="Enter name"
            fullWidth
          />
          <NumberField
            label="Card number"
            name="number"
            control={control}
            format={_cardNumberFormat}
            cardNumber
            isNumericString={true}
            placeholder="Enter number"
            fullWidth
            setCvvFormat={setCvvFormat}
            setCardNumberFormat={setCardNumberFormat}
          />
          <div className="d-flex">
            <NumberField
              label="Expiry date"
              name="expiry"
              control={control}
              format="##/##"
              placeholder="Enter date"
              className="mr-1"
              fullWidth
            />
            <NumberField
              label={cvvFormat.name}
              name="cvv"
              control={control}
              format={cvvFormat.size === 3 ? '###' : '####'}
              placeholder={`Enter ${cvvFormat.name}`}
              className="ml-1"
              fullWidth
            />
          </div>

          <div className="d-flex justify-content-center">
            <Button
              text="Buy"
              type="submit"
              size="md"
            />
          </div>
        </form>
      </div>
    </>
  );
}

export default BuyingSubscription;