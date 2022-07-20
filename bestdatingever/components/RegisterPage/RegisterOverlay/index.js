import Button from "components/Button";
import IconArrowBack from "components/icons/IconArrowBack";
import cn from "classnames";
import styles from "./index.module.scss";

function RegisterOverlay(
  {
    onRegister = () => {},
  }
) {
  return (
    <div className={styles['register-overlay']}>
      <img
        className={styles['top-left']}
        src="/img/auth/top-left-element.png"
        alt=""
      />
      <img
        className={styles['top-right']}
        src="/img/auth/bottom-right-element.png"
        alt=""
      />
      <img
        className={styles['circle-group']}
        src="/img/auth/circle-group.png"
        alt=""
      />
      <div className="container">
        <div className={cn(
          styles['text-wrap'],
          'mr-3 mr-lg-0 pt-lg-3'
        )}>
          <h1
            className={cn(
              styles.title,
              'text-normal text-new-york color-white'
            )}
          >
            Let Someone <br/>
            Steal Your Heart and
            Keep It Forever
          </h1>
          <p
            className={cn(
              styles.text,
              'title-xs color-white'
            )}
          >
            What is love? Well, when a person belly makes him feel sick and at the same time so light.
          </p>
          <Button
            theme="gradient"
            onClick={onRegister}
          >
            <span className="d-flex align-items-center px-3">
              Free Registration
              <IconArrowBack color="#ffffff" className="rotate-180 ml-2"/>
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RegisterOverlay;