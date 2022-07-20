import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import Captcha from "components/Captcha";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/contact";
import { contact } from "store/contact/contact";
import cn from "classnames";
import styles from './index.module.scss'

ContactPage.layouts = [AuthLayout]
ContactPage.accessMode = 'all'
ContactPage.title = 'Contact'

function ContactPage() {
  const { control, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues,
    resolver: yupResolver(schema)
  });
  
  const dispatch = useDispatch();
  
  const onSubmit = async data => {
    console.log('=> FormData', data);
    await dispatch(contact.thunks.contact(data));
    reset(defaultValues);
    window.grecaptcha.reset();
  };
  
  return (
    <div className="container p-sm-0">
      <form
        className={cn(
          styles.form,
          'form-overlay mx-auto'
        )}
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="title-xs text-medium text-center text-gilroy color-white mb-4">
          Contact us
        </div>
        <TextField
          id="lastName"
          label="Last name"
          name="lastName"
          control={control}
          fullWidth
          dark
        />
        <TextField
          id="firstName"
          label="First name"
          name="firstName"
          control={control}
          fullWidth
          dark
        />
        <TextField
          id="email"
          label="Email"
          name="email"
          control={control}
          fullWidth
          dark
        />
        <TextField
          id="message"
          label="Message"
          name="message"
          control={control}
          fullWidth
          dark
        />
        <Captcha
          label="Captcha*"
          name="captcha"
          control={control}
          className={cn(
            styles.captcha,
            'mb-4'
          )}
        />
        <div className="d-flex justify-content-between">
          <Button
            text="Send"
            type="submit"
            fullWidth
          />
        </div>
      </form>
    </div>
  );
}

export default ContactPage;
