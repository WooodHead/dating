import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import Captcha from "components/Captcha";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/contact";
import { contact } from "store/contact/contact";
import { mediaSizes } from "utils/constants";
import AuthHead from "components/AuthPage/AuthHead";
import { windowActions } from "store/windowActions";
import cn from "classnames";
import styles from './index.module.scss'

ContactPage.layouts = [AuthLayout]
ContactPage.accessMode = 'all'
ContactPage.title = 'Contact'

function ContactPage() {
  const { control, handleSubmit, reset } = useForm({
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
  
  const windowSize = useSelector(windowActions.selectors.windowSize);
  
  return (
    <div className="container">
      <div className={styles.wrap}>
        {windowSize.width >= mediaSizes.sm && (
          <AuthHead />
        )}
      
        <form
          className={cn(
            styles.form,
            'form-overlay mx-auto color-white'
          )}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="title-xs mb-3">
            Contact us
          </div>
          <TextField
            placeholder="Last name"
            name="lastName"
            control={control}
            fullWidth
            dark
          />
          <TextField
            placeholder="First name"
            name="firstName"
            control={control}
            fullWidth
            dark
          />
          <TextField
            placeholder="Email"
            name="email"
            control={control}
            fullWidth
            dark
          />
          <TextField
            placeholder="Message"
            name="message"
            control={control}
            fullWidth
            dark
          />
          <Captcha
            label="Captcha*"
            name="captcha"
            control={control}
            className="d-flex align-items-center justify-content-between flex-wrap color-grey-600 mb-1"
          />
          <div className="d-flex justify-content-between">
            <Button
              type="submit"
              size="lg"
              className="text-bold mx-auto"
              pink
            >
              Send
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
