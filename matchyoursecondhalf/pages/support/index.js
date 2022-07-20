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
import cn from "classnames";
import styles from "./index.module.scss";

SupportPage.layouts = [AuthLayout];
SupportPage.accessMode = 'private';

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
    <div className="container p-sm-0">
      <div className={styles.wrap}>
        <form
          className={cn(
            styles.form,
            'form-overlay'
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="title-xs text-medium text-bitter mb-4">
            Support
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
              fullWidth
              loader={contactStatus === 'pending'}
              dark
            />
          </div>
        </form>
        <div className={cn(
          styles['text-wrap'],
          'ml-3'
        )}>
          <h1
            className={cn(
              styles.title,
              'text-medium text-bitter'
            )}
          >
            Let Someone Steal Your Heart and Keep It Forever
          </h1>
          <p
            className={cn(
              styles.text,
              'title-xs'
            )}
          >
            What is love? Well, when a person belly
            makes him feel sick and at the
            same time so light.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SupportPage;
