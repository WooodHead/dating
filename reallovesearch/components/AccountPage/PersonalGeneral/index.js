import SelectField from "components/Form/SelectField";
import PersonalBoxTitle from "../PersonalBoxTitle";
import { useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import styles from "./index.module.scss";
import { prepareSelectOptions } from "utils/preps";
import { heights, weights } from "utils/constants";

function PersonalGeneral({ control }) {
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const weightOptions = prepareSelectOptions(weights);
  const heightOptions = prepareSelectOptions(heights);

  return (
    <div className={styles.wrap}>
      <PersonalBoxTitle>About</PersonalBoxTitle>
      <div className={styles.content}>
        <div className={styles['content__fields']}>

          <div>
            <SelectField
              label="Hair color"
              name="hair"
              options={additionalDataEnums.hair}
              control={control}
              fullWidth
              placeholder="Hair color"
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
              label="Eyes"
              name="eyes"
              options={additionalDataEnums.eyes}
              control={control}
              fullWidth
              placeholder="Eyes"
            />
          </div>
          <div>
            <SelectField
              label="Body type"
              name="bodyType"
              options={additionalDataEnums.bodyType}
              control={control}
              fullWidth
              placeholder="Body type"
            />
            <SelectField
              label="Height (cm)"
              name="height"
              options={heightOptions}
              control={control}
              placeholder="150"
              fullWidth
            />
            <SelectField
              label="Weight (kg)"
              name="weight"
              options={weightOptions}
              control={control}
              placeholder="40"
              fullWidth
            />
          </div>
          <div>
            <SelectField
              label="Diet"
              name="diet"
              options={additionalDataEnums.diet}
              control={control}
              fullWidth
              placeholder="All"
            />
            <SelectField
              label="Smoker"
              name="smoker"
              control={control}
              options={additionalDataEnums.smoke}
              fullWidth
              placeholder="Smoker"
            />
            <SelectField
              label="Alcohol"
              name="alcohol"
              control={control}
              options={additionalDataEnums.alcohol}
              fullWidth
              placeholder="Alcohol"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalGeneral;
