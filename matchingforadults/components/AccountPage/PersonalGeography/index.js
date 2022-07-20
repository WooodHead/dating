import SelectField from "components/Form/SelectField";
import { useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import PersonalBox from "../_shared/PersonalBox";
import PersonalBoxTitle from "../_shared/PersonalBoxTitle";

// import styles from "./index.module.scss";

function PersonalGeneral({ control }) {
  const additionalDataEnums = useSelector(additionalData.selectors.formattedEnums);
  const additionalDataNationals = useSelector(additionalData.selectors.formattedNationals);
  
  return (
    <PersonalBox>
      <PersonalBoxTitle>Geography</PersonalBoxTitle>
      <SelectField
        label="Nationality"
        name="nationality"
        options={additionalDataNationals}
        control={control}
        size="lg"
        placeholder="French"
      />
      <SelectField
        label="Ethnic Origin"
        name="ethnic"
        options={additionalDataEnums.ethnic}
        control={control}
        size="lg"
        placeholder="European"
      />
    </PersonalBox>
  );
}

export default PersonalGeneral;
