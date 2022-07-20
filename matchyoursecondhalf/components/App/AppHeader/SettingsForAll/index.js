import Link from "next/link";
import cn from "classnames";
import styles from "../_shared/index.module.scss";

function SettingsForAll() {
  return (
    <div className="d-flex align-items-center">
      <Link href="/contact">
        <a className={cn(
          styles.link,
          'text-md text-underline mr-3 color-grey-600'
        )}>
          Contact Us
        </a>
      </Link>
      <Link href="/register">
        <a className={cn(
          styles['link-register'],
          'text-md text-bold text-gilroy color-blue-600 mr-3'
        )}>
          Sign up
        </a>
      </Link>
      <Link href="/login">
        <a className={cn(
          styles['link-signup'],
          'text-md text-bold text-gilroy color-blue-600'
        )}>
          Log in
        </a>
      </Link>
    </div>
  )
}

export default SettingsForAll