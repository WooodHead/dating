import yup from "plugins/yup-config";

const defaultValues = {
  password: '',
  repeatPassword: ''
};

const schema = yup.object().shape({
  password: yup.string().min(6).required(),
  repeatPassword: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
});

export {
  defaultValues,
  schema
}
