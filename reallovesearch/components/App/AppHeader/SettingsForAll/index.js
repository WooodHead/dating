import Link from "next/link";
import cn from "classnames";
import linkStyles from "../_shared/index.module.scss";
import Button from "components/Button";

function SettingsForAll() {
  return (
    <div className="d-flex align-items-center">
      <Link href="/contact">
        <a className={cn(
          linkStyles.link,
          'text-md text-poppins text-underline'
        )}>
          Contact
        </a>
      </Link>
      <Link href="/register">
        <div className={cn(
          linkStyles['button-register'],
          'mr-3'
        )}>
          <Button
            text="Sign up"
            outline
            textSize="md"
            size="md"
          />
        </div>
      </Link>
      <Link href="/login">
        <div className={cn(
          linkStyles['button-login']
        )}>
          <Button
            text="Log in"
            textSize="md"
            size="md"
          />
        </div>
      </Link>
    </div>
  )
}

export default SettingsForAll