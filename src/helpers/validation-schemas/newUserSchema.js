import * as yup from 'yup'

const firstName = yup.string()
  .trim()
  .min(2, 'Please enter first name')
  .required('Please enter first name')
const lastName = yup.string()
  .trim()
  .min(2, 'Please enter last name')
  .required('Please enter last name')
const phoneNumber = yup.string()
  .trim()
  .min(9, 'Please enter a valid phone number')
  .max(10, 'It looks like that is too many digits')
  .required('Please enter phone number')
  .matches(/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{3,4}$/)
const nationality = yup.string()
  .trim()
  .required('Please select a nationality')
const countryCode = yup.string()
  .trim()
  .required('Please select a country code')
const email = yup.string()
  .trim()
  .email('Please enter a valid email address')
  .required('Please enter email address')


export default yup.object().shape({
  firstName,
  lastName,
  countryCode,
  phoneNumber,
  nationality,
  email
})