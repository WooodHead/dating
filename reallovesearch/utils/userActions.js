import store from "store";
import { selectors as authSelectors } from "store/auth/selectors";
import Router from "next/router";
import { relations } from "./constants";

const userIsLogged = () => {
  if (authSelectors.currentToken(store.getState())) return true
  
  Router.push('/login');
  return false
};

const userRelations = (relation) => {
  if (relation === relations.BLOCK) return true;
  // if (relation === relations.DEFAULT)
  return false;
};

const changingUserDataWhoOnline = (state, key, payload) => {
  if (payload.action === 'add') {
    state[key].online = true;
  }
  
  if (payload.action === 'remove') {
    state[key].online = false;
    state[key].updatedAt = Date.now(new Date());
  }
};

export {
  userIsLogged,
  userRelations,
  changingUserDataWhoOnline,
}