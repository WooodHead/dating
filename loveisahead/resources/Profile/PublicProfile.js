import { format } from "date-fns";
import { userRelations } from "utils/userActions";

export default class PublicProfile {
  constructor(user) {
    this.user = { ...user };
  }
  
  getAge(date) {
    if (!date) return '';
    
    const dateParse = format(Date.parse(date), "yyyy");
    const dateNow = format(Date.now(), "yyyy");
    
    return dateNow - dateParse;
  }

  getDistance(value) {
    if (value) return value;
    else return 0;
  }
  
  getPublicProfile() {
    const {
      createdAt,
      dob,
      languages,
      relations,
      updatedAt,
      distance,
      ...data
    } = this.user;
    
    return {
      ...data,
      updatedAt: Date.parse(updatedAt),
      age: this.getAge(dob),
      languages: languages || [],
      blockedFrom: userRelations(relations.from),
      blockedTo: userRelations(relations.to),
      distance: this.getDistance(distance),
    };
  }
}
