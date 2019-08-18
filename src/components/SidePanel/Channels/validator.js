import { isEmpty } from "../../../utils/is-empty";
// import validator from "validator";

const validateChannelInput = data => {
  let errors = {};

  if (!isFormValid(data)) return (errors.notValid = "Please enter all fields.");

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

const isFormValid = ({ channelName, channelDetails }) =>
  channelName && channelDetails;

export default validateChannelInput;
