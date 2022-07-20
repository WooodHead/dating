import AuthLayout from "layouts/Auth";
import SubscriptionList from "components/AccountPage/SubscriptionList";
import styles from './index.module.scss'
import cn from "classnames";
import Router from "next/router";

Subscription.accessMode = 'private';
Subscription.layouts = [AuthLayout];

function Subscription() {
    return (
        <div className={cn(
            styles.wrap,
            'container'
        )}>
            <div className={styles['inner-wrap']}>
                <div className="color-white mt-5">
                    <p className="title-md text-semibold text-gilroy">Choose your subscription</p>
                    <p className="mt-1 text-md text-semibold">Use a premium subscription to use all the platform's features</p>
                </div>
                <SubscriptionList classNamePlans={styles.plans} classNamePlan={styles.plan}/>
                <div className={cn(
                    styles['button-wrap'],
                    'd-flex justify-content-end mt-2 mb-5 mr-3'
                )}>
                    <div className="color-white text-xl text-semibold p-2 cursor-pointer text-letter-1"
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