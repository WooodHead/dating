import IconTick from "components/icons/IconTick";
import Button from "components/Button";
import cn from "classnames";
import styles from './index.module.scss'

function SubscriptionPlans(
  {
    plan,
    isActionVisible = true,
    isActive,
    withShadow = true,
    className,
    onClick = () => {
    },
  }
) {

  const tickColor = () => {
    switch (plan.title) {
      case 'Standard':
        return '#355C7D'
      case 'Trial':
        return '#C06C84'
      case 'Premium':
        return '#F4C4AE'
      default :
        return '#355C7D'
    }
  }

  return (
    <div key={plan.title} className={cn(
      styles.plan,
      withShadow ? styles['plan-single'] : styles['plan-default'],
      {[styles['plan--active']]: isActive},
      className
    )}>
      <div className={cn(
        styles['plan__header'],
        'd-flex align-items-center'
      )}>
        <div className={styles['plan-icon']}>
          {plan.icon}
        </div>
        <div className="ml-2 text-xl text-semibold">
          <p>{plan.title}</p>
          <p>{plan.price} <span>{plan.direction && `/ ${plan.direction}`}</span></p>
        </div>
      </div>
      <div className={styles['plan__body']}>
        <ul className={styles.accesses}>
          {plan.accesses.map((access) => (
            <li className="d-flex align-items-baseline" key={access.text}>
              <div className={styles['access-icon']}>
                {access.included ? (
                  <IconTick size='xs' color={tickColor()}/>
                ) : (
                  <img src="/img/plans/icon-included-false.svg" alt=""/>
                )}
              </div>
              <p className={cn(
                styles['access-text'],
                'text-md text-medium'
              )}>
                {access.text}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {isActionVisible && (
        <div className={styles['plan__action']}>
          {isActive ? (
            <div
              className={cn(
              styles['actions-active'],
              'd-flex justify-content-center align-items-center text-semibold text-xl'
            )}
              style={{color: plan.buttonColor}}
            >
              Active
            </div>
          ) : (
            <Button
              fullWidth
              dark
              text={plan.buttonText || 'Try now'}
              style={{background: plan.buttonColor}}
              onClick={() => onClick(plan._id, plan.type)}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default SubscriptionPlans