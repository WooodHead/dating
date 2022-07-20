import yup from "plugins/yup-config";

const defaultValues = {
    phone: '',
};
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup.object().shape({
    phone: yup.string()
        .matches(phoneRegExp, 'Phone number is not valid')
        .max(15)
        .required()
});

export {
    defaultValues,
    schema
}
