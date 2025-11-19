import { jwtDecode } from "jwt-decode";

const DecodeJwt = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
};
export default DecodeJwt;
