import * as yup from 'yup'
import { firstName, lastName, email } from './newUserSchema.js'

// stored numbers include the country code, so the signup max length doesn't apply
const phoneNumber = yup.string()
  .trim()
  .min(9, 'Please enter a valid phone number')
  .required('Please enter phone number')

export default yup.object().shape({
  first_name: firstName,
  last_name: lastName,
  email,
  phone_number: phoneNumber
})
