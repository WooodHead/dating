import AuthLayout from "layouts/Auth";
import SubscriptionList from "components/AccountPage/SubscriptionList";
import Router from "next/router";
import cn from "classnames";
import styles from './index.module.scss'

Subscription.accessMode = 'private';
Subscription.layouts = [AuthLayout];

function Subscription() {
  return (
    <div className={cn(
      styles.wrap,
      'container'
    )}>
      <div className={styles['inner-wrap']}>
        <div className="mt-5">
          <p className="title-md text-semibold color-white">Choose your subscription</p>
          <p className="mt-1 text-md text-semibold color-white">Use a premium subscription to use all the platform's
            features</p>
        </div>
        <SubscriptionList classNamePlans={styles.plans} classNamePlan={styles.plan} dark/>
        <div className={cn(
          styles['button-wrap'],
          'd-flex justify-content-end mt-2 mb-5 mr-3'
        )}>
          <div className="text-xl text-semibold p-2 cursor-pointer text-letter-1 color-white"
               onClick={() => Router.push('/')}
          >
            Skip for now >
          </div>
        </div>
      </div>
    </div>
  )
}

export default Subscription