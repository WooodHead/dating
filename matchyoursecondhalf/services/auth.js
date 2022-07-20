import Cookies from "js-cookie";

const authService = {
  setCookies({ token }) {
    Cookies.set('token', token);
  },
  removeCookies() {
    Cookies.remove('token');
  },
};

export { authService };
