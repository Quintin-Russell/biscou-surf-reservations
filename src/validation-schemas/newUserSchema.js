import * as yup from 'yup'

const firstName = yup.string().trim().required('Please enter first name')
const lastName = yup.string().trim().required('Please enter last name')
const phoneNumber = yup.string().trim().required('Please enter phone number (including the country code)').matches(/^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{3,4}[-\s\.]?[0-9]{3,4}$/)
const nationality = yup.string().trim().required('Please select a nationality')
const countryCode = yup.string().trim().required('Please select a country code')

export default yup.object().shape({
  firstName,
  lastName,
  countryCode,
  phoneNumber,
  nationality
})