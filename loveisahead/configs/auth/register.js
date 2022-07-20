import yup from "plugins/yup-config";

const defaultValues = {
  gender: 'Male',
  preference: 'Male',
  dob: '',
  name: '',
  email: '',
  password: '',
  terms: false,
  privacy: false
};

const schema = yup.object().shape({
  dob: yup.string().nullable().required(),
  name: yup.string().max(16).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  location: yup.object().nullable().required(),
  terms: yup.boolean().oneOf([true]),
  privacy: yup.boolean().oneOf([true]),
});

export {
  defaultValues,
  schema
}
