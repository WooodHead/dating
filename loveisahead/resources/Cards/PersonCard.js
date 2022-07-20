import { format } from "date-fns";

export default class Person {
  constructor(person) {
    this.person = { ...person };
    this.defaultPerson = {
      age: '',
      avatarPath: '',
      likes: {
        heart: 0,
        like: 0,
        isUserPutHeart: false,
        isUserPutLike: false,
      },
      cityName: '',
      country: {},
      location: {},
      name: '',
      online: false,
      professional: '',
      status: '',
      updatedAt: '',
      user: '',
      _id: '',
      distance: 0,
    };
  }
  
  getAge(date) {
    const dateParse = format(Date.parse(date), "yyyy");
    const dateNow = format(Date.now(), "yyyy");
    
    return dateNow - dateParse;
  }

  getDistance(value) {
    if (value) return value;
    else return 0;
  }
  
  getPerson() {
    const {
      _id,
      user,
      avatarPath,
      name,
      online,
      dob,
      location,
      professional,
      status,
      updatedAt,
      likes,
      distance,
    } = this.person;
    
    return {
      _id,
      user,
      avatarPath,
      name,
      online,
      professional,
      status,
      updatedAt,
      likes: likes || { ...this.defaultPerson.likes },
      location: location || {},
      age: this.getAge(dob),
      distance: this.getDistance(distance),
    };
  }
}