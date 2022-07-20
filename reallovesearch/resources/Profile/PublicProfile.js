import { format } from "date-fns";
import { userRelations } from "utils/userActions";
import { generateRandomInt } from "utils/preps";

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
  
  getPublicProfile() {
    const {
      createdAt,
      dob,
      languages,
      relations,
      updatedAt,
      ...data
    } = this.user;
    
    return {
      ...data,
      updatedAt: Date.parse(updatedAt),
      age: this.getAge(dob),
      languages: languages || [],
      blockedFrom: userRelations(relations.from),
      blockedTo: userRelations(relations.to),
      distance: generateRandomInt(10, 200),
    };
  }
}
