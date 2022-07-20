import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import Captcha from "components/Captcha";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/contact";
import { contact } from "store/contact/contact";
import styles from "./index.module.scss";
import cn from "classnames";

ContactPage.layouts = [AuthLayout]
ContactPage.accessMode = 'all'

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
  
  // console.log('=> errors', errors);
  
  return (
    <div className="container">
      <div className={styles.wrap}>
        <form
          className={cn(
            styles.form,
            'form-overlay'
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="title-xs text-medium text-poppins mb-2">
            Contact us
          </div>
          <TextField
            id="lastName"
            label="Last name"
            name="lastName"
            control={control}
            fullWidth
          />
          <TextField
            id="firstName"
            label="First name"
            name="firstName"
            control={control}
            fullWidth
          />
          <TextField
            id="email"
            label="Email"
            name="email"
            control={control}
            fullWidth
          />
          <TextField
            id="message"
            label="Message"
            name="message"
            control={control}
            fullWidth
          />
          <Captcha
            label="Captcha*"
            name="captcha"
            control={control}
            className="mb-4"
          />
          <div className="d-flex justify-content-between">
            <Button
              text="Send"
              type="submit"
              textSize="lg"
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

export default ContactPage;
