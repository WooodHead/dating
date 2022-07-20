import IconTick from "components/icons/IconTick";
import Button from "components/Button";
import cn from "classnames";
import styles from './index.module.scss'

function SubscriptionPlans(
  {
    plan,
    isActionVisible = true,
    withShadow = true,
    isActive,
    className,
    onClick = () => {
    },
  }
) {

  const tickColor = () => {
      switch (plan.title) {
          case 'Standard':
              return '#FFFFFF'
          case 'Trial':
              return '#DA6D2F'
          case 'Premium':
              return '#EF2F4E'
          default :
              return '#FFFFFF'
      }
  }

  return (
    <div key={plan.title} className={cn(
      styles.plan,
      withShadow ? styles['plan-single'] : styles['plan-default'],
      { [styles['plan--active']]: isActive },
      className
    )}>
      <div className={cn(
        styles['plan__header'],
        'd-flex align-items-center'
      )}>
        <div className={styles['plan-icon']}>
          {plan.icon}
        </div>
        <div className="ml-2 text-xl">
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
                    <IconTick size='xs' color={tickColor()} />
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
              'd-flex justify-content-center align-items-center text-lg'
            )}
              style={{color:  plan.activeColor || plan.buttonColor }}
            >
              Active
            </div>
          ) : (
            <Button
              fullWidth
              style={{ background: plan.buttonColor, fontSize: plan.buttonTextSize }}
              onClick={() => onClick(plan._id, plan.type)}
            >
              {plan.buttonText || 'Try now'}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default SubscriptionPlans