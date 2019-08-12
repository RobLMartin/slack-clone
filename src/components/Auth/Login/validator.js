import { isEmpty } from "../../../utils/is-empty";
// import validator from "validator";

const validateLoginInput = data => {
  let errors = {};

  if (isFormEmpty(data)) {
    errors.formEmpty = "Fill in all fields.";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

export default validateLoginInput;

const isFormEmpty = ({ email, password }) => {};
