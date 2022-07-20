import * as yup from 'yup'

const validationMessages = {
  mixed: {
    required: 'This field is required',
  },
  string: {
    // eslint-disable-next-line
    min: 'This field must be at least ${min} characters',
    max: 'This field must be at most ${max} characters',
    email: 'Please enter valid email',
  },
  number: {
    positive: 'This field must be greater than 0',
  }
};

yup.setLocale(validationMessages);

export default yup;