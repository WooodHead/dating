import { useRouter } from "next/router";
import Button from "components/Button";
import cn from "classnames";
import styles from "./index.module.scss";

function Page404() {
  const router = useRouter();
  
  return (
    <div className={styles.wrap}>
      <img
        className={cn(styles.img, 'mb-3')}
        src="/img/404/not-found.png"
        alt=""
      />
      <div className={cn(styles.title, 'text-semibold text-palatino mb-3')}>
        Page not found
      </div>
      <div className="text-center text-md text-semibold mb-3">
        We’re sorry, the page you requested could not be found.<br/>
        Please go back to the homepage
      </div>
      <div>
        <Button
          text={<div className="px-4">Back to home</div>}
          onClick={() => router.push('/')}
        />
      </div>
    </div>
  );
}

export default Page404;
