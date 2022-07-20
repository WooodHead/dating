import yup from "plugins/yup-config";

const defaultValues = {
  genderType: 'All',
  message: {
    website: false,
    email: false,
  },
  sharedAlbum: {
    website: true,
    email: true,
  },
  global: {
    website: true,
    email: true,
  },
};

const schema = yup.object().shape({

});

export {
  defaultValues,
  schema
}
