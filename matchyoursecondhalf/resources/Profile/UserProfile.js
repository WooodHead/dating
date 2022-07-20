import { prepareSelectOptions } from "utils/preps";

export default class UserProfile {
  constructor(user) {
    const { profile, subscription } = user;
    const { email, phone } = user.user;
    this.user = { ...profile, subscription: {...subscription}, ...user.user };
    if (email) this.user.email = email;
    if (phone) this.user.phone = phone;
  }

  dobParse(date) {
    return date ? Date.parse(date) : ''
  }

  getLanguages(languages) {
    if (!languages?.length) return [];

    return prepareSelectOptions(languages);
  }
  
  getLocation(location) {
    if (!location) return {}
    
    return {
      _id: location._id,
      value: location.cityName,
      label: location.cityName,
      path: location.country?.pathToFlag
    }
  }

  getSubscriptionPlan(product) {
    return typeof product?.rule === 'string' && product?.rule.toLowerCase() !== 'free';
  }

  getUserData() {
    const {
      createdAt,
      updatedAt,
      ...data
    } = this.user;

    return {
      ...data,
      location: this.getLocation(data?.location),
      languages: this.getLanguages(data?.languages),
      nationality: data?.nationality?.name || '',
      dob: this.dobParse(data.dob),
      isPremiumUser: this.getSubscriptionPlan(data.subscription.product),
    };
  }

  getUserEditedData() {
    const {
      createdAt,
      updatedAt,
      ...data
    } = this.user;

    return {
      ...data,
      location: this.getLocation(data?.location),
      languages: this.getLanguages(data?.languages),
      nationality: data?.nationality?.name || '',
      dob: this.dobParse(data.dob),
    };
  }
}
