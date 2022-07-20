import { useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import Username from "./Username";
import cn from "classnames";
import styles from "./index.module.scss";

function PublicDescription() {
  const { bio } = useSelector(publicProfile.selectors.profile);
  
  return (
    <div className={styles.wrap}>
      <Username />
      
      {bio && (
        <article className={cn(
          styles.article,
          'd-flex text-md text-italic text-letter-1'
        )}>
          <img
            src="/img/general/icon-quote-before.svg/"
            alt=""
            className="icon-default mr-1"
          />
          <div className="text-lg text-italic text-break-word">
            {bio}
            <img
              src="/img/general/icon-quote-after.svg/"
              alt=""
              className="icon-default ml-1"
            />
          </div>
        </article>
      )}
    </div>
  );
}

export default PublicDescription;
