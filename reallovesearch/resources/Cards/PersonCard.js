import { format } from "date-fns";
import { generateRandomInt } from "utils/preps";

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
      distance: generateRandomInt(10, 200),
    };
  }
}