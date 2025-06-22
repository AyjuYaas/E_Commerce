export default function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6 || password.length > 100) {
    errors.push("Password must be between 6 and 100 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one digit");
  }

  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*)"
    );
  }

  if (/\s/.test(password)) {
    errors.push("Password must not contain spaces");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
