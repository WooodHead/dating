import { useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import SelectField from "components/Form/SelectField";
import { weights, heights } from "utils/constants";
import { prepareSelectOptions } from "utils/preps";
import styles from "./index.module.scss";
import cn from "classnames";

function PersonalBody({ control }) {
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const weightOptions = prepareSelectOptions(weights);
  const heightOptions = prepareSelectOptions(heights);

  return (
    <div className={styles.wrap}>
      <div className="text-xl text-bold mb-3">
        3 Body parameters
      </div>
      <div className={styles.content}>
        <div className={styles['content__fields']}>
            <SelectField
              label="Body type"
              name="bodyType"
              options={additionalDataEnums.bodyType}
              control={control}
              fullWidth
              placeholder="Body type"
            />
            <SelectField
              label="Hair type"
              name="hairType"
              options={additionalDataEnums.hairType}
              control={control}
              fullWidth
              placeholder="Hair type"
            />
            <SelectField
              label="Hair color"
              name="hair"
              options={additionalDataEnums.hair}
              control={control}
              fullWidth
              placeholder="Hair color"
            />
            <SelectField
              label="Eyes"
              name="eyes"
              options={additionalDataEnums.eyes}
              control={control}
              fullWidth
              placeholder="Eyes"
            />
        </div>
        <div className={cn(
          styles['content__sizes'],
          'd-flex'
        )}>
          <SelectField
            label="Weight (kg)"
            name="weight"
            options={weightOptions}
            control={control}
            size="sm"
            placeholder="40"
            className={cn(
              styles['sizes-filed'],
              'mr-3 mr-sm-0'
            )}
          />
          <SelectField
            label="Height (cm)"
            name="height"
            options={heightOptions}
            control={control}
            size="sm"
            placeholder="150"
            className={styles['sizes-filed']}
          />
        </div>
      </div>
    </div>
  );
}

export default PersonalBody;
