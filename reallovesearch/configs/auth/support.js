import yup from "plugins/yup-config";

const defaultValues = {
  topic: '',
  description: '',
};

const schema = yup.object().shape({
  topic: yup.string().required(),
  description: yup.string().required(), //.max(500),
});

export {
  defaultValues,
  schema
}
