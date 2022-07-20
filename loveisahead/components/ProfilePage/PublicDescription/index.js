import PublicBox from "components/ProfilePage/PublicBox";
import PublicBoxTitle from "components/ProfilePage/PublicBoxTitle";
import { useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import LastConnection from "./LastConnection";
import cn from "classnames";
import styles from "./index.module.scss";

function PublicDescription() {
  const {
    name,
    professional,
    age,
    status,
    languages,
    bio,
    updatedAt,
    online,
    distance,
    location,
  } = useSelector(publicProfile.selectors.profile);

  return (
    <PublicBox className="p-3 mb-4">
      <div className={styles['public-box-title']}>
        <PublicBoxTitle>
          <div className="title-sm color-blue-700 mb-1">{name}</div>
          <div className="d-flex justify-content-between text-md text-italic text-normal text-lato">
            <LastConnection online={online} updatedAt={updatedAt} />
            <p>{distance === 0 ? location.cityName : `${distance} km from you`}</p>
          </div>
        </PublicBoxTitle>
      </div>
      <div className="d-flex align-items-center mb-3">
        <div className={styles.position}>{professional || '-'}</div>
        <div className={styles.position}>{age} y.o</div>
        <div>{status || '-'}</div>
      </div>
      <div className="mb-4">
        <span className="d-inline-flex text-semibold color-blue-700 mr-1">
          Languages:
        </span>
        <span className="d-inline-flex align-items-center">
          {languages.length > 0 ? languages.map(lang => (
            <span
              key={lang._id}
              className={styles.language}
            >
              {lang.name}
            </span>
          )) : '-'}
        </span>
      </div>
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
          <div className="text-break-word">
            {bio}
            <img
              src="/img/general/icon-quote-after.svg/"
              alt=""
              className="icon-default ml-1"
            />
          </div>
        </article>
      )}
    </PublicBox>
  );
}

export default PublicDescription;
