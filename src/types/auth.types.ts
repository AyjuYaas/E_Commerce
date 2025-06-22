export interface SignUpFormType {
  name: string;
  email: string;
  password: string;
  dob: Date | undefined;
}

export interface LoginFormType {
  email: string;
  password: string;
}
