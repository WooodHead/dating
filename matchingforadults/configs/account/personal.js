import yup from "plugins/yup-config";

const defaultValues = {
  // photo and story
  avatarPath: '',
  bio: '',
  name: '',
  // general
  gender: 'Male',
  status: 'Single',
  preference: 'All',
  dob: '',
  location: {},
  professional: '',
  languages: [],
  nationality: '',
  ethnic: '',
  // body parameters
  bodyType: '',
  hairType: '',
  hair: '',
  eyes: '',
  weight: 0,
  height: 0,
  // selects
  diet: 'All',
  smoker: 'Yes',
  alcohol: 'Occasionally'
};

const schema = yup.object().shape({
  bio: yup.string().max(200),
  name: yup.string().max(16).required(),
  ethnic: yup.string().required(),
  professional: yup.string().required(),
  bodyType: yup.string().required(),
  hairType: yup.string().required(),
  hair: yup.string().required(),
  eyes: yup.string().required(),
  location: yup.object().nullable().required(),
});

export {
  defaultValues,
  schema
}
