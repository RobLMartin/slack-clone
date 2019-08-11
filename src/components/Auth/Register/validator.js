import { isEmpty } from "../../../utils/is-empty";
// import validator from "validator";

const validateRegisterInput = data => {
  let errors = {};

  if (isFormEmpty(data)) errors.formEmpty = "Fill in all fields.";
  if (!isPasswordValid(data)) errors.passwordInvalid = "Password is invalid.";

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateRegisterInput;

const isFormEmpty = ({ username, email, password, passwordConfirmation }) => {
  return (
    !username.length ||
    !email.length ||
    !password.length ||
    !passwordConfirmation.length
  );
};

const isPasswordValid = ({ password, passwordConfirmation }) => {
  if (password.length < 6 || passwordConfirmation.length < 6) {
    return false;
  } else if (password !== passwordConfirmation) {
    return false;
  } else {
    return true;
  }
};
