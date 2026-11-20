import * as yup from 'yup'

const password = yup.string()
  .required('Please enter a password')
  .matches(/[A-Z]/, 'Must contain one uppercase letter')
  .matches(/[a-z]/, 'Must contain one lowercase letter')
  .matches(/\d/, 'Must contain one number')
  .matches(/[!@#$%^&*]/, 'Must contain one special character')
const passwordConfirmation = yup.string()
  .required('Please confirm your password')
  .oneOf([yup.ref('password')], 'Passwords must match')

export default yup.object().shape({
  password,
  password_confirmation: passwordConfirmation
})
