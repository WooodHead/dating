import yup from "plugins/yup-config";

const defaultValues = {
  number: '',
  name: '',
  cvv: '',
  expiry: ''
};

const schema = yup.object().shape({
  number: yup.string().required(),
  name: yup.string().required(),
  cvv: yup.string().required().min(3),
  expiry: yup.string().required().min(4),
});

export {
  defaultValues,
  schema
}
