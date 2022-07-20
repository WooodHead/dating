import Button from "components/Button";
import PersonalBoxTitle from "../PersonalBoxTitle";
import SelectField from "components/Form/SelectField";
import { useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import { userEditProfile } from "store/user/edit-profile";
import styles from "./index.module.scss";

function PersonalNutrition({ control }) {
  const additionalDataNationals = useSelector(additionalData.selectors.formattedNationals);
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const editProfileStatus = useSelector(userEditProfile.selectors.editProfileStatus)

  return (
    <div className={styles.wrap}>
      <PersonalBoxTitle>Geography</PersonalBoxTitle>
      <div className={styles.content}>
        <div className={styles['content__fields']}>
          <div>
            {/*<SelectField*/}
            {/*  label="Profession"*/}
            {/*  name="professional"*/}
            {/*  options={additionalDataEnums.professional}*/}
            {/*  control={control}*/}
            {/*  fullWidth*/}
            {/*  placeholder="Profession"*/}
            {/*/>*/}
            <SelectField
              label="Nationality"
              name="nationality"
              options={additionalDataNationals}
              control={control}
              fullWidth
              placeholder="French"
            />
            <SelectField
              label="Ethnic Origin"
              name="ethnic"
              options={additionalDataEnums.ethnic}
              control={control}
              fullWidth
              placeholder="European"
            />
          </div>
        </div>
      </div>
      <div className={styles.button}>
        <Button
          text="Submit"
          type="submit"
          textSize="md"
          loader={editProfileStatus === 'pending'}
        />
      </div>
    </div>
  );
}

export default PersonalNutrition;
