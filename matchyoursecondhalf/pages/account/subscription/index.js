import MainLayout from "layouts/Main";
import MySubscription from "layouts/MySubscription";
import SubscriptionList from "components/AccountPage/SubscriptionList";

Subscription.layouts = [MainLayout, MySubscription]

function Subscription() {
  return (
    <div className="mt-3">
      <div>
        <p className="title-md text-semibold text-bitter">Choose your subscription</p>
        <p className="mt-1 text-md text-semibold">Use a premium subscription to use all the platform's features</p>
      </div>
      <SubscriptionList />
    </div>
  )
}

export default Subscription