import { useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import MultiSelectField from "components/Form/MultiSelectField";
import PersonalHeader from "../_shared/Header";

// import styles from "./index.module.scss";

function PersonalLanguages({ control }) {
  const additionalDataLang = useSelector(additionalData.selectors.formattedLang);
  
  return (
    <div className="mb-4">
      <PersonalHeader>Languages</PersonalHeader>
      <div className="d-flex">
        <div className="text-xl text-black text-nowrap mt-1 mr-2">Languages</div>
        <MultiSelectField
          name="languages"
          options={additionalDataLang}
          control={control}
          fullWidth
          placeholder="English"
          size="sm"
        />
      </div>
    </div>
  );
}

export default PersonalLanguages;
