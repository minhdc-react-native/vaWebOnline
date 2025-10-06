// Define UUID type for consistent usage
export type UUID = string;

// Language code type for user preferences
export type LanguageCode = 'vi' | 'en';

// Auth model representing the authentication session
export interface AuthModel {
  access_token: string;
  refresh_token?: string;
}

// User model representing the user profile
export interface UserModel {
  username: string;
  pass: string;
  dvcs: string;
  remember: boolean;
}

export interface IYear {
  NAM: string;
  TU_NGAY: string;
  DEN_NGAY: string;
  QD_AD: number | null
}