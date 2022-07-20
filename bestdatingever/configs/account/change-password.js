import yup from "plugins/yup-config";

const defaultValues = {
  currentPassword: '',
  newPassword: '',
  repeatPassword: '',
};

const schema = yup.object().shape({
  currentPassword: yup.string().required().min(6),
  newPassword: yup.string().required().min(6),
  repeatPassword: yup.string().required().min(6).oneOf([yup.ref('newPassword'), null], 'New password must match'),
});

export {
  defaultValues,
  schema
}
