import yup from "plugins/yup-config";

const defaultValues = {
  lastName: '',
  firstName: '',
  email: '',
  message: '',
  captcha: null
};

const schema = yup.object().shape({
  lastName: yup.string().required(),
  firstName: yup.string().required(),
  email: yup.string().email().required(),
  captcha: yup.mixed().required()
});

export {
  defaultValues,
  schema
}
