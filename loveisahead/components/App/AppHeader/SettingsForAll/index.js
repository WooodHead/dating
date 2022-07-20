import Link from "next/link";
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
          'text-lg text-underline'
        )}>
          Contact
        </a>
      </Link>
      <Link href="/register">
        <a className={cn(
          linkStyles['link-register'],
          'text-lg text-semibold text-gilroy color-gold-400 mr-3 mr-sm-2'
        )}>
          Sign up
        </a>
      </Link>
      <Link href="/login">
        <a className={cn(
          linkStyles['link-signup'],
          'text-lg text-semibold text-gilroy color-gold-400'
        )}>
          Log in
        </a>
      </Link>
    </div>
  );
}

export default SettingsForAll;
