import yup from "plugins/yup-config";

const defaultValues = {
  email: '',
};

const schema = yup.object().shape({
  email: yup.string().email().required(),
});

export {
  defaultValues,
  schema
}
