import PublicBox from "components/ProfilePage/PublicBox";
import { useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import LastConnection from "./LastConnection";
import cn from "classnames";
import styles from "./index.module.scss";
import PublicReportMenu from "../PublicReportMenu";


function PublicDescription() {
  const {
    name,
    professional,
    age,
    location,
    status,
    languages,
    bio,
    updatedAt,
    online,
    distance,
  } = useSelector(publicProfile.selectors.profile);

  return (
    <PublicBox>
      <div className={cn(
        styles['title-wrap'],
        'd-flex align-items-center'
      )}>
        <div className={cn(
          styles.title,
          'd-flex align-items-center mr-2'
        )}>
          <div className="title-sm text-semibold color-blue-900 mb-1 mb-md-0 text-break-word">{name}</div>
          <div className="text-italic text-normal color-grey-600 ml-3 ml-md-0">
            <LastConnection online={online} updatedAt={updatedAt}/>
            <p>{distance}&nbsp;km from you</p>
          </div>
        </div>
        <PublicReportMenu />
      </div>
      <div className={cn(
        styles['content-wrap'],
        'text-md color-blue-900 '
      )}>
        <div className="d-flex align-items-center mb-2">
          <div className="text-semibold">Age:</div>
          <div className="ml-1">{age}</div>
        </div>
        <div className="d-flex align-items-center mb-2">
          <div className="text-semibold">Location:</div>
          <div className="ml-1">{location?.country?.name || '-'}</div>
        </div>
        <div className="d-flex align-items-center mb-2">
          <div className="text-semibold">Status:</div>
          <div className="ml-1">{status || '-'}</div>
        </div>
        <div className="d-flex align-items-center mb-2">
          <div className="text-semibold">Profession:</div>
          <div className="ml-1">{professional || '-'}</div>
        </div>
        <div className="mb-2">
          <div className="text-semibold">Bio:</div>
          <div className={styles.bio}>
            <div className={styles['bio__text']}>{bio || '-'}</div>
          </div>
        </div>
        <div>
          <div className="text-semibold">
            Languages:
          </div>
          <div className={cn(
            styles['language-wrap'],
            'd-flex align-items-center mt-1'
          )}>
            {languages.length > 0 ? languages.map(lang => (
              <div
                key={lang._id}
                className={cn(
                  styles.language,
                  'text-semibold'
                )}
              >
                {lang.name}
              </div>
            )) : '-'}
          </div>
        </div>
      </div>
    </PublicBox>
  );
}

export default PublicDescription;
