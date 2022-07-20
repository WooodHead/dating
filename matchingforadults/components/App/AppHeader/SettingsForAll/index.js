import Link from "next/link";
import Button from "components/Button";
import cn from "classnames";
import linkStyles from "../_shared/index.module.scss";
import styles from './index.module.scss'

function SettingsForAll() {
  return (
    <div className={cn(
      styles.wrap,
      'd-flex align-items-center'
    )}>
      <Link href="/contact">
        <a className={cn(
          linkStyles.link,
          linkStyles['link-contact'],
          'text-lg text-underline'
        )}>
          Contact us
        </a>
      </Link>
      <div className={cn(styles['actions-web'], 'd-flex align-items-center')}>
        <Link href="/login">
          <a className="mr-3">
            <Button className="text-bold" outline pink>
              Log in
            </Button>
          </a>
        </Link>
        <Link href="/register">
          <a>
            <Button className="text-bold" pink>
              Sign up
            </Button>
          </a>
        </Link>
      </div>
      <div className={styles['actions-mobile']}>
        <Link href="/login">
          <a className="mr-3">
            Log in
          </a>
        </Link>
        <Link href="/register">
          <a>
            Sign up
          </a>
        </Link>
      </div>
    </div>
  );
}

export default SettingsForAll;
