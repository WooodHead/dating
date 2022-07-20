import yup from "plugins/yup-config";

const defaultValues = {
  gender: 'All',
  minAge: 18,
  maxAge: 99,
  location: '',
  distance: 200,
  isWithPhoto: false,
  isOnline: false,
  isRegisterIn15Days: false,

  languages: [],
  status: '',
  professional: '',
  ethnic: '',
  nationality: '',
  hair: '', // hair color
  hairType: '',
  eyes: '',
  bodyType: '',
  height: 0,
  weight: 0,
  diet: '',
  smoker: '',
  alcohol: '',
};

const schema = yup.object().shape({});

export {
  defaultValues,
  schema
}
