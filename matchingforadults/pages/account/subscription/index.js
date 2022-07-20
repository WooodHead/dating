import MainLayout from "layouts/Main";
import SubscriptionList from "components/AccountPage/SubscriptionList";

Subscription.layouts = [MainLayout]

function Subscription() {
  return (
    <div>
      <div>
        <p className="title-xs text-bold text-palatino">My subscription</p>
      </div>
      <div className="mt-3">
        <p className="title-md text-semibold">Choose your subscription</p>
        <p className="mt-1 text-md text-semibold">Use a premium subscription to use all the platform's features</p>
      </div>
      <SubscriptionList />
    </div>
  )
}

export default Subscription