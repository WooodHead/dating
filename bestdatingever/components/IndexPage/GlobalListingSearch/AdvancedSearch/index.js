import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import { heights, weights } from "utils/constants";
import { prepareSelectOptions } from "utils/preps";
import SelectField from "components/Form/SelectField";
import MultiSelectField from "components/Form/MultiSelectField";
import AdvancedSearchTitle from "./AdvancedSearchTitle"
import IconFilter from "components/icons/IconFilter";
import styles from "./index.module.scss";

function AdvancedSearch({ control }) {
  const [isOpen, setIsOpen] = useState(false);

  const enums = useSelector(additionalData.selectors.enums);
  const nationals = useSelector(additionalData.selectors.nationals);
  const formattedLang = useSelector(additionalData.selectors.formattedLang);
  const formattedEnums = useMemo(() => {
    const { gender, preference, ...params } = Object.entries(enums).reduce((obj, item) => {
      if (item[0] === 'diet') {
        obj[item[0]] = prepareSelectOptions(item[1]);
      } else {
        obj[item[0]] = [{ value: '', label: 'All' }, ...prepareSelectOptions(item[1])];
      }

      return obj;
    }, {});

    return params;
  }, [enums]);
  const formattedNationals = [{ value: '', label: 'All' }, ...prepareSelectOptions(nationals)];
  const formattedHeights = [{ value: '', label: 'All' }, ...prepareSelectOptions(heights)];
  const formattedWeights = [{ value: '', label: 'All' }, ...prepareSelectOptions(weights)];

  return (
    <>
      {isOpen && (
        <>
          <AdvancedSearchTitle>General description</AdvancedSearchTitle>
          <div className={styles.row}>
            <div>
              <div className="text-md text-semibold">
                Languages
              </div>
              <div className="d-flex">
                <MultiSelectField
                  name="languages"
                  control={control}
                  options={formattedLang}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Status
              </div>
              <div className="d-flex">
                <SelectField
                  name="status"
                  control={control}
                  options={formattedEnums.status}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Profession
              </div>
              <div className="d-flex">
                <SelectField
                  name="professional"
                  control={control}
                  options={formattedEnums.professional}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Ethnic Origin
              </div>
              <div className="d-flex">
                <SelectField
                  name="ethnic"
                  control={control}
                  options={formattedEnums.ethnic}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Nationality
              </div>
              <div className="d-flex">
                <SelectField
                  name="nationality"
                  control={control}
                  options={formattedNationals}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
          </div>

          <AdvancedSearchTitle>Body parameters</AdvancedSearchTitle>
          <div className={styles.row}>
            <div>
              <div className="text-md text-semibold">
                Hair color
              </div>
              <div className="d-flex">
                <SelectField
                  name="hair"
                  control={control}
                  options={formattedEnums.hair}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Hair type
              </div>
              <div className="d-flex">
                <SelectField
                  name="hairType"
                  control={control}
                  options={formattedEnums.hairType}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Eye color
              </div>
              <div className="d-flex">
                <SelectField
                  name="eyes"
                  control={control}
                  options={formattedEnums.eyes}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Body type
              </div>
              <div className="d-flex">
                <SelectField
                  name="bodyType"
                  control={control}
                  options={formattedEnums.bodyType}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Min Height (cm)
              </div>
              <div className="d-flex">
                <SelectField
                  name="height"
                  control={control}
                  options={formattedHeights}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Min Weight (kg)
              </div>
              <div className="d-flex">
                <SelectField
                  name="weight"
                  control={control}
                  options={formattedWeights}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
          </div>

          <AdvancedSearchTitle>Nutrition, habits</AdvancedSearchTitle>
          <div className={styles.row}>
            <div>
              <div className="text-md text-semibold">
                Diet
              </div>
              <div className="d-flex">
                <SelectField
                  name="diet"
                  control={control}
                  options={formattedEnums.diet}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Smoker
              </div>
              <div className="d-flex">
                <SelectField
                  name="smoker"
                  control={control}
                  options={formattedEnums.smoke}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
            <div>
              <div className="text-md text-semibold">
                Alcohol
              </div>
              <div className="d-flex">
                <SelectField
                  name="alcohol"
                  control={control}
                  options={formattedEnums.alcohol}
                  placeholder="All"
                  fullWidth
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div
        className="d-flex align-items-center text-md text-semibold text-gilroy cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IconFilter className="mr-1" />
        Advanced Search
      </div>
    </>
  );
}

export default AdvancedSearch;
