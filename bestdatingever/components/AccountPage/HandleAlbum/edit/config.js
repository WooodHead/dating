import yup from "plugins/yup-config";

const defaultValues = {
  name: '',
  type: ''
};

const schema = yup.object().shape({
  name: yup.string().max(16).trim().required(),
  type: yup.string().required(),
});

export {
  defaultValues,
  schema
}
