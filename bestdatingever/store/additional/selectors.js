import { prepareRadioOptions, prepareSelectOptions } from "utils/preps";

const selectors = {
  enums: state => state.additionalData.enums,
  lang: state => state.additionalData.lang,
  nationals: state => state.additionalData.nationals,
  
  locationPag: state => state.additionalData.locationPag,

  locationStatus: state => state.additionalData.locationStatus,

  formattedEnums: state => {
    const additionalData = state.additionalData.enums;

    return {
      bodyType: prepareSelectOptions(additionalData?.bodyType),
      hairType: prepareSelectOptions(additionalData?.hairType),
      hair: prepareSelectOptions(additionalData?.hair),
      eyes: prepareSelectOptions(additionalData?.eyes),
      professional: prepareSelectOptions(additionalData?.professional),
      ethnic: prepareSelectOptions(additionalData?.ethnic),
      gender: prepareRadioOptions(additionalData?.gender),
      status: prepareRadioOptions(additionalData?.status),
      diet: prepareRadioOptions(additionalData?.diet),
      smoke: prepareRadioOptions(additionalData?.smoke),
      alcohol: prepareRadioOptions(additionalData?.alcohol),
    }
  },
  formattedLang: state => prepareSelectOptions(state.additionalData.lang),
  formattedNationals: state => prepareSelectOptions(state.additionalData.nationals),
  formattedLocation: state => state.additionalData.location?.map(loc => ({
    _id: loc._id,
    value: loc.cityName,
    label: loc.cityName,
    path: loc.country.pathToFlag,
  })),
};

export { selectors };
