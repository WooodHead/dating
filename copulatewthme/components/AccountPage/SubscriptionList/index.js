import PopupConfirm from "components/Popups/PopupConfirm";
import SubscriptionPlan from "components/AccountPage/SubscriptionPlan";
import { subscriptionPlans } from "utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { buyingSubscription } from "store/user/subscription/buying";
import { userProfile } from "store/user/profile";
import { windowActions } from "store/windowActions";
import { mediaSizes } from "utils/constants";
import Router from "next/router";
import styles from './index.module.scss'
import cn from 'classnames'


function SubscriptionList({classNamePlans, classNamePlan}) {
  const dispatch = useDispatch();

  const profile = useSelector(userProfile.selectors.profile);
  const [preparedSubscription, setPreparedSubscription] = useState([...subscriptionPlans]);
  const [popupNotification, setPopupNotification] = useState(false);
  const windowSize = useSelector(windowActions.selectors.windowSize);

  const onTryNow = (planId, planType) => {
    if(planType !== 'Free') {
      dispatch(buyingSubscription.actions.SET_PLAN_ID(planId));
      Router.push('/account/subscription/buying');
      return
    }
    setPopupNotification(true);
  };

  const activePlan = useMemo(() => {
    return profile.subscription?.product?.rule;
  }, [profile.subscription])

  useEffect(() => {
    if(activePlan === 'Premium') {
      setPreparedSubscription([...subscriptionPlans.filter((item) => item.type !== 'Trial')])
    }
  }, [activePlan])

  return (
    <>
      <div className={cn(
        styles.plans,
        classNamePlans,
      )}>
        {preparedSubscription.map((plan) => (
          <SubscriptionPlan
            key={plan._id}
            plan={plan}
            withShadow={(windowSize.width <= mediaSizes.md)}
            className={cn(
              styles.plan,
              classNamePlan,
            )}
            onClick={onTryNow}
            isActive={activePlan === plan.type}
          />
        ))}
      </div>
      {popupNotification && (
        <PopupConfirm
          size="md"
          btnConfirmText="Confirm"
          onCancel={() => setPopupNotification(false)}
          onClose={() => setPopupNotification(false)}
        >
          <div className="mb-3">
            Are you sure you want to back to standard plan?
          </div>
        </PopupConfirm>
      )}
    </>
  )
}

export default SubscriptionList