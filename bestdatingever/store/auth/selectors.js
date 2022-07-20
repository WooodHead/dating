const selectors = {
  currentToken: state => !!state.auth.token?.length,
  jwtToken: state => state.auth.token,
  loginStatus: state => state.auth.loginStatus,
};

export { selectors };
