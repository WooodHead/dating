import { useSelector } from "react-redux";
import { additionalData } from "store/additional/additionalData";
import SelectField from "components/Form/SelectField";
import { weights, heights } from "utils/constants";
import { prepareSelectOptions } from "utils/preps";
import styles from "./index.module.scss";

function PersonalBody({ control }) {

  return (
    <div className={styles.wrap}>
      <div className="text-xl text-bold mb-3">
        3 Body parameters
      </div>
      <div className={styles.content}>
        <div className={styles['content__fields']}>
          <div>


            <div className="d-flex">


            </div>
          </div>
          <div>


          </div>
        </div>
      </div>
    </div>
  );
}

export default PersonalBody;
