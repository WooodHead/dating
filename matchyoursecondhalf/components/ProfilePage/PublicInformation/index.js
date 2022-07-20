import PublicBoxTitle from "components/ProfilePage/PublicBoxTitle";
import { useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import cn from "classnames";
import styles from "./index.module.scss";
import { chunk } from 'lodash';

function PublicInformation() {
  const publicUserProfile = useSelector(publicProfile.selectors.profile);
  
  const countValues = 4;
  
  const defaultList = [
    { slug: 'hair', title: 'Hair color', value: '' },
    { slug: 'hairType', title: 'Hair type', value: '' },
    { slug: 'eyes', title: 'Eye color', value: '' },
    { slug: 'bodyType', title: 'Body type', value: '' },
    { slug: 'height', title: 'Height (cm)', value: '' },
    { slug: 'weight', title: 'Weight (kg)', value: '' },
    { slug: 'diet', title: 'Diet', value: '' },
    { slug: 'smoker', title: 'Smoker', value: '' },
    { slug: 'alcohol', title: 'Alcohol', value: '' },
    { slug: 'nationality', title: 'Nationality', value: publicUserProfile.nationality?.name || '' },
    { slug: 'ethnic', title: 'Ethnic Origin', value: '' },
    { slug: 'location', title: 'Location', value: publicUserProfile?.location?.cityName || '' }
  ];
  
  const formattedList = chunk(defaultList.map(item => ({
    ...item,
    value: item.value || publicUserProfile[item.slug] || '-'
  })), countValues);
  
  return (
    <div className="mb-8 mb-md-4">
      <PublicBoxTitle>Information</PublicBoxTitle>
      <div className={cn(
        styles.info,
        'px-2 px-md-1'
      )}>
        {formattedList && formattedList.map((col, key) => (
          <div key={`col-${key + 1}`}>
            {col.map(item => (
              <div
                key={item.slug}
                className={
                  cn(
                    styles['list__row'],
                    'text-md'
                  )
                }
              >
                <div className={cn(
                  styles['list__title'],
                  'd-flex align-items-center text-semibold color-blue-900 text-letter-0-3 mr-2'
                )}>
                  {item.title}:
                </div>
                <div className="color-grey-600">{item.value}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PublicInformation;
