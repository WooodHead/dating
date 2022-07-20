import Link from "next/link";
import cn from "classnames";
import linkStyles from "../_shared/index.module.scss";
import styles from './index.module.scss'

function SettingsForAll() {
  return (
    <div className={cn(
      styles.wrap,
      'd-flex align-items-center text-lg text-semibold'
    )}>
      <Link href="/contact">
        <a className={linkStyles.link}>
          Contact us
        </a>
      </Link>
      <Link href="/register">
        <a className={cn(
          linkStyles['link-register'],
          'mr-3 mr-sm-2'
        )}>
          Sign up
        </a>
      </Link>
      <Link href="/login">
        <a className={linkStyles['link-signup']}>
          Log in
        </a>
      </Link>
    </div>
  );
}

export default SettingsForAll;
