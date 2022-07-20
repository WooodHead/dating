import { format, isToday } from "date-fns";

const objectOrArray = val => {
  if (typeof val === "object") { // return if is not array or object
    try {
      for (let x of val)  // is no errors happens here is an array
        break;
      return "array";
    } catch {
      return "object"; // if there was an error is an object
    }
  } else return false;
}

const includesEntries = (data) => {
  const current = {};

  Object.entries(data).forEach(param => {
    if (param[1]) current[param[0]] = param[1];
  });

  return current;
};

const prepareRadioOptions = options => {
  const params = option => ({ label: option, option: option });

  if (objectOrArray(options) === 'array') return options?.map(params);
  if (objectOrArray(options) === 'object') return Object.values(options)?.map(params);

  return [];
};

const prepareSelectOptions = options => {
  const params = option => {
    if (objectOrArray(option) === 'object') return { _id: option._id, value: option.name, label: option.name }
    else return { value: option, label: option };
  };

  if (objectOrArray(options) === 'object') return Object.values(options)?.map(params);
  if (objectOrArray(options) === 'array') return options?.map(params);

  return [];
};

const prepareFormData = data => {
  const form = new FormData();

  Object.entries(data).forEach(elem => {
    form.append(elem[0], elem[1]);
  });

  return form;
};

const prepareArrayForFormData = (propertyName, array) => {
  const obj = {};

  array.forEach((elem, key) => {
    obj[`${propertyName}[${key}]`] = elem;
  });

  return obj;
};

const formattedDateForChat = (createdAt) => {
  let date = createdAt || null;
  if (!date) return 'Invalid date';
  date = Date.parse(date);
  if (isToday(date)) return format(date, 'HH:mm')
  return format(date, 'dd.MM.y')
};

const generateRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export {
  includesEntries,
  prepareRadioOptions,
  prepareSelectOptions,
  prepareFormData,
  prepareArrayForFormData,
  formattedDateForChat,
  generateRandomInt,
};
