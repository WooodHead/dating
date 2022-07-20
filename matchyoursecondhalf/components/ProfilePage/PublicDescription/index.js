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
  } = useSelector(publicProfile.selectors.profile);

  return (
    <div className='mb-5 mb-md-4'>
      <div className={styles['public-box-title']}>
        <PublicBoxTitle>
          <div className="title-sm text-medium text-roboto-slab color-blue-900 mb-1">{name}</div>
          <div className="text-md text-normal color-grey-600">
            <p>{distance}&nbsp;km from you</p>
            <LastConnection online={online} updatedAt={updatedAt}/>
          </div>
        </PublicBoxTitle>
      </div>
      <div className="mb-3">
        <div>
          <span className={cn(
            styles['description-title'],
            'd-inline-flex text-md text-semibold text-letter-0-3 color-blue-900 mr-2'
          )}>
            Languages:
          </span>
            <span className="d-inline-flex align-items-center">
            {languages.length > 0 ? languages.map(lang => (
              <span
                key={lang._id}
                className={cn(
                  'text-md color-grey-600',
                  styles.language
                )}
              >
              {lang.name}
            </span>
            )) : '-'}
          </span>
        </div>
        <div className='mt-1'>
          <span className={cn(
            styles['description-title'],
            'd-inline-flex text-md text-semibold text-letter-0-3 color-blue-900 mr-2'
          )}>
            Profession:
          </span>
          <span className='text-md color-grey-600'>{professional || '-'}</span>
        </div>
        <div className='mt-1'>
          <span className={cn(
            styles['description-title'],
            'd-inline-flex text-md text-semibold text-letter-0-3 color-blue-900 mr-2'
          )}>
            Status:
          </span>
          <span className='text-md color-grey-600'>{status || '-'}</span>
        </div>
        <div className='mt-1'>
          <span className={cn(
            styles['description-title'],
            'd-inline-flex text-md text-semibold text-letter-0-3 color-blue-900 mr-2'
          )}>
            Age:
          </span>
          <span className='text-md color-grey-600'>{age} y.o</span>
        </div>
      </div>
      <article className='text-md text-letter-1 text-word-break'>
        <p className="text-semibold  text-letter-0-3 color-blue-900">About me:</p>
        <p className="color-grey-600">{bio || '-'}</p>
      </article>
    </div>
  );
}

export default PublicDescription;
