import { useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import SelectField from "components/Form/SelectField";
import { weights, heights } from "utils/constants";
import { prepareSelectOptions } from "utils/preps";
import PersonalBox from "../_shared/PersonalBox";
import PersonalBoxTitle from "../_shared/PersonalBoxTitle";
import styles from "./index.module.scss";

function PersonalBody({ control }) {
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const weightOptions = prepareSelectOptions(weights);
  const heightOptions = prepareSelectOptions(heights);

  return (
    <PersonalBox>
      <PersonalBoxTitle>
        Information
      </PersonalBoxTitle>
      
      <div className={styles.content}>
        <div>
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
            label="Weight (kg)"
            name="weight"
            options={weightOptions}
            control={control}
            placeholder="40"
            fullWidth
          />
          <SelectField
            label="Height (cm)"
            name="height"
            options={heightOptions}
            control={control}
            placeholder="150"
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
            placeholder="Diet"
          />
          <SelectField
            label="Smoker"
            name="smoker"
            options={additionalDataEnums.smoke}
            control={control}
            fullWidth
            placeholder="Smoker"
          />
          <SelectField
            label="Alcohol"
            name="alcohol"
            options={additionalDataEnums.alcohol}
            control={control}
            fullWidth
            placeholder="Alcohol"
          />
        </div>
      </div>
    </PersonalBox>
  );
}

export default PersonalBody;
