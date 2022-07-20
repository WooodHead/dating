import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import TextAreaField from "components/Form/TextAreaField";
import Button from "components/Button";
import { useForm } from "react-hook-form";
import { defaultValues, schema } from "configs/auth/support";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { contact } from "store/contact/contact";
import { userProfile } from "store/user/profile";
import styles from "./index.module.scss";
import cn from "classnames";

SupportPage.layouts = [AuthLayout];
SupportPage.accessMode = 'private';
SupportPage.title = 'Support'

function SupportPage() {
  const dispatch = useDispatch();
  const { control, handleSubmit, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });
  const user = useSelector(userProfile.selectors.profile);
  const contactStatus = useSelector(contact.selectors.contactStatus);
  
  const onSubmit = data => {
    const formData = {
      firstName: user.name,
      lastName: user.name,
      email: user.email,
      message: `${data.topic} - ${data.description}`,
    };
    dispatch(contact.thunks.contact(formData));
    reset(defaultValues);
  };
  
  return (
    <div className="container my-sm-2">
      <div className={styles.wrap}>
        <form
          className={cn(
            styles.form,
            'form-overlay'
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="title-xs text-medium text-poppins color-blue-900 mb-2">
            Support
          </div>
          <div className="text-md mb-4">
            If you have any questions or suggestions, please contact us using the form below:
          </div>
          <div className="mb-2">
            <TextField
              id="topic"
              label="Topic"
              name="topic"
              control={control}
              fullWidth
            />
            <TextAreaField
              label="Description"
              name="description"
              control={control}
              fullWidth
              sizeHeight="lg"
            />
          </div>
          <div className="d-flex justify-content-between">
            <Button
              text="Send"
              type="submit"
              loader={contactStatus === 'pending'}
              fullWidth
            />
          </div>
        </form>
        <div className={styles.img}>
          <img src="/img/auth/auth-bg.svg" alt=""/>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
