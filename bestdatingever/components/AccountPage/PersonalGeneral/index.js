import SelectField from "components/Form/SelectField";
import { useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import { prepareSelectOptions } from "utils/preps";
import { heights, weights } from "utils/constants";
import RadioField from "components/Form/RadioField";
import PersonalHeader from "../_shared/Header";
import styles from "./index.module.scss";

function PersonalGeneral({ control }) {
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const weightOptions = prepareSelectOptions(weights);
  const heightOptions = prepareSelectOptions(heights);
  
  return (
    <div className={styles.wrap}>
      <PersonalHeader>Information</PersonalHeader>
      <div className={styles.content}>
        <div>
          <div className={styles.row}>
            <div className="text-xl text-black text-nowrap mt-1 mr-2">Hair color:</div>
            <SelectField
              name="hair"
              options={additionalDataEnums.hair}
              control={control}
              fullWidth
              placeholder="Hair color"
            />
          </div>
          <div className={styles.row}>
            <div className="text-xl text-black text-nowrap mt-1 mr-2">Hair type:</div>
            <SelectField
              name="hairType"
              options={additionalDataEnums.hairType}
              control={control}
              fullWidth
              placeholder="Hair type"
            />
          </div>
          <div className={styles.row}>
            <div className="text-xl text-black text-nowrap mt-1 mr-2">Eye color:</div>
            <SelectField
              name="eyes"
              options={additionalDataEnums.eyes}
              control={control}
              fullWidth
              placeholder="Eyes"
            />
          </div>
        </div>
        <div>
          <div className={styles.row}>
            <div className="text-xl text-black text-nowrap mt-1 mr-2">Body type:</div>
            <SelectField
              name="bodyType"
              options={additionalDataEnums.bodyType}
              control={control}
              fullWidth
              placeholder="Body type"
            />
          </div>
          <div className={styles.row}>
            <div className="text-xl text-black text-nowrap mt-1 mr-2">Height (cm):</div>
            <SelectField
              name="height"
              options={heightOptions}
              control={control}
              placeholder="150"
              fullWidth
            />
          </div>
          <div className={styles.row}>
            <div className="text-xl text-black text-nowrap mt-1 mr-2">Weight (kg):</div>
            <SelectField
              name="weight"
              options={weightOptions}
              control={control}
              placeholder="40"
              fullWidth
            />
          </div>
        </div>
      </div>
      <div className={styles.radios}>
        <div className={styles['row__radio']}>
          <div className="text-md text-semibold">Diet:</div>
          <div className={styles['row__radio-field']}>
            <RadioField
              name="diet"
              control={control}
              options={additionalDataEnums.diet}
              classes="mr-5 mr-xl-2 mb-lg-1"
            />
          </div>
        </div>
        <div className={styles['row__radio']}>
          <div className="text-md text-semibold">Smoker:</div>
          <div className={styles['row__radio-field']}>
            <RadioField
              name="smoker"
              control={control}
              options={additionalDataEnums.smoke}
              classes="mr-5 mr-xl-2 mb-lg-1"
            />
          </div>
        </div>
        <div className={styles['row__radio']}>
          <div className="text-md text-semibold">Alcohol:</div>
          <div className={styles['row__radio-field']}>
            <RadioField
              name="alcohol"
              control={control}
              options={additionalDataEnums.alcohol}
              classes="mr-5 mr-xl-2 mb-lg-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalGeneral;
