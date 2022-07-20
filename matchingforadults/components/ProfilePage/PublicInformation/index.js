import PublicBox from "components/ProfilePage/PublicBox";
import PublicBoxTitle from "components/ProfilePage/PublicBoxTitle";
import { useSelector } from "react-redux";
import { publicProfile } from "store/profile/public-profile";
import { chunk } from 'lodash';
import styles from "./index.module.scss";

function PublicInformation() {
  const publicUserProfile = useSelector(publicProfile.selectors.profile);
  
  const countValues = 6;
  
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
    value: item.value ||publicUserProfile[item.slug] || '-'
  })), countValues);
  
  return (
    <PublicBox className="p-3 mb-4">
      <PublicBoxTitle>Information</PublicBoxTitle>
      <div className={styles.info}>
        {formattedList && formattedList.map((col, key) => (
          <div key={`col-${key + 1}`}>
            {col.map(item => (
              <div key={item.slug} className={styles['list__row']}>
                <div className="text-semibold color-grey-700">{item.title}:</div>
                <div>{item.value}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </PublicBox>
  );
}

export default PublicInformation;
