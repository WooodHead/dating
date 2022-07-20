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
    dark = false,
    onClick = () => {
    },
  }
) {
  const tickColor = () => {
    switch (plan.title) {
      case 'Standard':
        return dark ? '#FFFFFF' : '#000000'
      case 'Trial':
        return '#FFA6A9'
      case 'Premium':
        return '#A16294'
      default :
        return '#000000'
    }
  }

  const setIcon = () => {
    if (plan.alternativeIcon) return dark ? plan.alternativeIcon : plan.icon
    else return plan.icon
  }

  return (
    <div key={plan.title} className={cn(
      styles.plan,
      withShadow ? styles['plan-single'] : styles['plan-default'],
      {[styles['plan--active']]: isActive},
      {[styles['plan--dark']]: dark},
      {[styles['plan-default--dark']]: dark && !withShadow},
      className
    )}>
      <div className={styles.contentWrapper}>
        <div className={cn(
          styles['plan__header'],
          'd-flex align-items-center'
        )}>
          <div className={styles['plan-icon']}>
            {setIcon()}
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
                  styles.accessText,
                  {[styles['accessesText--dark']]: dark},
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
                style={{color: !dark && plan.buttonColor}}
              >
                Active
              </div>
            ) : (
              <Button
                fullWidth
                border={false}
                style={{background: plan.buttonColor}}
                onClick={() => onClick(plan._id, plan.type)}
              >
                <span className='text-semibold'>{plan.buttonText || 'Try now'}</span>
              </Button>
            )}
          </div>
        )}
      </div>
      <div className={cn(
        styles.blur,
        {[styles['blur--active']]: dark && plan.isActive},
      )}/>
    </div>
  )
}

export default SubscriptionPlans