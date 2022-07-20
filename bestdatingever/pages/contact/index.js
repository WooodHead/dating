import AuthLayout from "layouts/Auth";
import TextField from "components/Form/TextField";
import Button from "components/Button";
import Captcha from "components/Captcha";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import { defaultValues, schema } from "configs/auth/contact";
import { contactUs } from "store/contact";
import CheckboxField from "components/Form/CheckboxField";
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
  const contactStatus = useSelector(contactUs.selectors.contactStatus);
  
  const onSubmit = async data => {
    await dispatch(contactUs.thunks.contact(data));
    reset(defaultValues);
    window.grecaptcha.reset();
  };
  
  return (
    <div className={styles.container}>
      <div className={cn(
        styles['form-overlay'],
        'form-overlay p-sm-0 mx-auto'
      )}>
        <div className={styles.info}>
          <div className="title-md text-semibold text-new-york color-orange-500 mb-2 ">
            Contact Us
          </div>
          <p className="color-white mb-3">
            For all your questions, suggestions or possible issues during the use of our service. Or fill in the form
            beside:
          </p>
          <div className="d-flex align-items-center color-white">
            <CheckboxField
              name="support"
              control={control}
              white
              className="mr-1"
            />
            support@bestdatingever.com
          </div>
          <img
            src="/img/auth/contact-us-circle.png"
            alt=""
            className={styles['contact-us-circle']}
          />
        </div>
        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
        >
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
            className="color-white mb-2"
          />
          <div className="d-flex justify-content-center">
            <Button
              type="submit"
              theme="gradient"
              size="lg"
              loader={contactStatus === 'pending'}
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
