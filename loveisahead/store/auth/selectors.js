const selectors = {
  currentToken: state => !!state.auth.token?.length,
  jwtToken: state => state.auth.token,
};

export { selectors };
