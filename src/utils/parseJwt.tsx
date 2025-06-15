interface ParsedJwtTokenParams {
  name: string | null;
  email: string | null;
  userId: string | null;
}

const parseJwt = (token: string): ParsedJwtTokenParams => {
  if (!token) {
    return {
      name: null,
      email: null,
      userId: null,
    };
  }
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');

  return JSON.parse(window.atob(base64));
};

export default parseJwt;
