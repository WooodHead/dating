import RadioField from "components/Form/RadioField";
import Button from "components/Button";
import { useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import { userEditProfile } from "store/user/edit-profile";
import styles from "./index.module.scss";

function PersonalNutrition({ control }) {
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const editProfileStatus = useSelector(userEditProfile.selectors.editProfileStatus)

  return (
    <div className={styles.wrap}>
      <div className="title-xs text-semibold mb-3 color-blue-900">
        Nutrition, habits
      </div>
      <div className={styles.content}>
        <div className={styles['content__fields']}>
          <div>
            <div className="text-md text-semibold mb-2">Diet:</div>
            <div className="d-flex flex-column">
              <RadioField
                name="diet"
                control={control}
                options={additionalDataEnums.diet}
                classes="mb-2"
              />
            </div>
          </div>
          <div>
            <div className="text-md text-semibold mb-2">Smoker:</div>
            <div className="d-flex flex-column">
              <RadioField
                name="smoker"
                control={control}
                options={additionalDataEnums.smoke}
                classes="mb-2"
              />
            </div>
          </div>
          <div>
            <div className="text-md text-semibold mb-2">Alcohol:</div>
            <div className="d-flex flex-column">
              <RadioField
                name="alcohol"
                control={control}
                options={additionalDataEnums.alcohol}
                classes="mb-2"
              />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.button}>
        <Button
          text="Submit"
          type="submit"
          dark
          textSize="xl"
          loader={editProfileStatus === 'pending'}
        />
      </div>
    </div>
  );
}

export default PersonalNutrition;
