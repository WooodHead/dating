import MainLayout from "layouts/Main";
import MySubscription from "layouts/MySubscription";
import SubscriptionList from "components/AccountPage/SubscriptionList";
import styles from './index.module.scss'
import cn from "classnames";

Subscription.layouts = [MainLayout, MySubscription]

function Subscription() {
  return (
    <div className="mt-4">
      <div className={cn(
        styles.text,
        'text-center'
      )}>
        <p className="title-md text-semibold">Choose your subscription</p>
        <p className="mt-1 text-md text-semibold">Use a premium subscription to use all the platform's features</p>
      </div>
      <SubscriptionList />
    </div>
  )
}

export default Subscription