import TextAreaField from "components/Form/TextAreaField";
import InputField from "components/Form/InputField";
import styles from "./index.module.scss";

function PersonalAboutMyself({ control }) {
  return (
    <div className={styles.info}>
      <div className="text-xl text-italic mb-1">User Name</div>
      <div className="d-flex align-items-start mb-1">
        <InputField
          name="name"
          control={control}
          fullWidth
          outline
        />
        <div className={styles['delete-account']}>
          <img src="/img/profile/icon-backet.svg" alt="" className="icon-default mr-1" />
          Delete account
        </div>
      </div>
      <div className="mb-4 mb-md-1">
        <div className="text-xl text-italic mb-1">Bio</div>
        <TextAreaField
          name="bio"
          control={control}
          helperFieldText="The maximum number of characters is 200"
          fullWidth
          outline
        />
      </div>
    </div>
  );
}

export default PersonalAboutMyself;
