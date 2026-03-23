import { jwtDecode } from 'jwt-decode';

export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
  sub: string;
}

export const decodeGoogleCredential = (credential: string): GoogleUser | null => {
  try {
    return jwtDecode<GoogleUser>(credential);
  } catch (error) {
    console.error('Failed to decode Google credential:', error);
    return null;
  }
};
