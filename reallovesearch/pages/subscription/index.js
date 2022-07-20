import AuthLayout from "layouts/Auth";
import { mediaSizes } from "utils/constants";
import SubscriptionList from "components/AccountPage/SubscriptionList";
import { useSelector } from "react-redux";
import { windowActions } from "store/windowActions";
import Router from "next/router";
import IconArrowButton from "components/icons/IconArrowButton";
import LoginOverlay from "components/LoginOverlay";
import styles from './index.module.scss'
import cn from "classnames";

Subscription.accessMode = 'private';
Subscription.layouts = [AuthLayout];

function Subscription() {
  const windowSize = useSelector(windowActions.selectors.windowSize);

  return (
    <>
      {windowSize.width >= mediaSizes.md && <LoginOverlay />}
      <div className={cn(
        styles.wrap,
        'container'
      )}>
        <div className={styles['inner-wrap']}>
          <div className="mt-5">
            <p className="title-md text-medium color-blue-900">Choose your subscription</p>
            <p className="mt-1 text-md text-medium color-blue-900">Use a premium subscription to use all the platform's features</p>
          </div>
          <SubscriptionList classNamePlans={styles.plans} />
          <div className={cn(
            styles['button-wrap'],
            'd-flex justify-content-end mt-2 mb-5 mr-3'
          )}>
            <div className="color-blue-900 text-xl text-semibold p-2 cursor-pointer text-letter-1 d-flex align-items-center"
                 onClick={() => Router.push('/')}
            >
              Skip for now <
              IconArrowButton
              color="#000000"
              className="ml-1"
            />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Subscription