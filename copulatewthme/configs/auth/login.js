import yup from "plugins/yup-config";

const defaultValues = {
  email: '',
  password: ''
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().min(6).required()
});

export {
  defaultValues,
  schema
}
