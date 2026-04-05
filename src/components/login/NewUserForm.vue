<script setup>
  import { defineProps, defineEmits, computed } from "vue"
  import { Form } from '@primevue/forms'
  import {InputText, Fieldset, Select, Button, Password} from "primevue"

  import { useFormValidation} from "@/compostables/useFormValidation.js"
  import countryData from '@/helpers/country-data.js'
  import newUserSchema from '@/validation-schemas/newUserSchema.js'
  import { userService } from "@/services";

  // props
  const props = defineProps(['email'])

  // emits
  const emit = defineEmits(['newUserLogin', 'hide'])

  // computed
  const passwordError = computed(() => {
    if (!password.value?.length || password.value === passwordConfirmation.value?.trim()) return ""
    let errorMessage = 'Passwords must match'
    if (errors?.passwordConfirmation) {
      errorMessage = errors.passwordConfirmation
    }
    return errorMessage
  })
  const emailError = computed(() => {
    if (!isDirty.value || props.email === emailConfirmation.value?.trim()) return ''
    let errorMessage = 'Emails must match'
    if (errors?.emailConfirmation) {
      errorMessage = errors.emailConfirmation
    }
    return errorMessage
  })

  // form data and validations
  const {
    isSubmitting,
    submitError,
    isDirty,
    defineField,
    errors,
    validateForm,
  } = useFormValidation(newUserSchema)

  const [firstName, firstNameAttrs] = defineField('firstName')
  const [lastName, lastNameAttrs] = defineField('lastName')
  const [emailConfirmation, emailConfirmationAttrs] = defineField('emailConfirmation')
  const [password, passwordAttrs] = defineField('password')
  const [passwordConfirmation, passwordConfirmationAttrs] = defineField('passwordConfirmation')
  const [countryCode, countryCodeAttrs] = defineField('countryCode')
  const [phoneNumber, phoneNumberAttrs] = defineField('phoneNumber')
  const [nationality, nationalityAttrs] = defineField('nationality')

  // methods
  const emitHide = () => {
    emit('hide')
  }
  const emitLogin = (user) => emit('newUserLogin', user)
  const handleNewUser = async () => {
    try {
      const formData = {
        email: props.email,
        password: password.value,
        first_name: firstName.value,
        last_name: lastName.value,
        phone_number: `${countryCode.value}${phoneNumber.value}`,
        nationality: nationality.value,
      }
      const user = await userService.create(formData)
      emitLogin(user)
    } catch (e) {
      throw e
    }
  }
  const handleSubmit = async () => {
    const formIsValid = await validateForm()

    if (!formIsValid) {
      // add error stuff here
      console.log("Aborting form submission: Form data not valid")
      return
    }

    try {
      isSubmitting.value = true
      await handleNewUser()
    } catch (e) {
      submitError.value = e.message
    } finally {
      isSubmitting.value = false
    }
  }
</script>
<template>
  <Fieldset legend="Sign Up">
    <Button severity="secondary" variant="text" @click="emitHide">
      <i class="pi pi-arrow-left m-2"></i>
      <span>Back</span>
    </Button>
    <Form class="flex flex-col justify-center items-center w-75 m-auto" @submit="handleSubmit">
        <InputText
            class="w-75"
            :value="props.email"
            disabled
        />
      <div class="flex flex-col w-75 mt-2">
        <InputText
          v-model="emailConfirmation"
          v-bind="emailConfirmationAttrs"
          placeholder="Confirm Email Address"
        />
        <small v-if="emailError" class="text-red-400">{{ emailError }}</small>
      </div>
      <div class="flex w-75 justify-between m-2">
       <div class="flex flex-col w-40">
          <InputText
              v-model="firstName"
              v-bind="firstNameAttrs"
              placeholder="First Name"
          />
          <small v-if="errors.firstName" class="text-red-400">{{ errors.firstName }}</small>
        </div>
        <div class="flex flex-col w-40">
        <InputText
              v-model="lastName"
              v-bind="lastNameAttrs"
              placeholder="Last Name"
          />
          <small v-if="errors.lastName" class="text-red-400">{{ errors.lastName }}</small>
        </div>
      </div>
      <div class="flex flex-col w-75">
        <div class="flex">
          <div class="flex flex-col">
            <Select
                v-model="countryCode"
                :options="countryData"
                filter
                optionLabel="name"
                optionValue="code"
                placeholder="Select a Country"
            />
            <small v-if="errors.countryCode" class="text-red-400">{{ errors.countryCode }}</small>
          </div>
          <div class="flex flex-col w-75">
            <InputText
                v-model="phoneNumber"
                v-bind="phoneNumberAttrs"
                placeholder="Enter Your Phone Number"
            />
            <small v-if="errors.phoneNumber" class="text-red-400">{{ errors.phoneNumber }}</small>
          </div>
        </div>
      </div>
      <div class="flex mt-2 flex-col w-75">
        <Select
            v-model="nationality"
            :options="countryData"
            filter
            optionLabel="name"
            optionValue="iso3"
            placeholder="Tell Us Where You Live"
        />
        <small v-if="errors.nationality" class="text-red-400">{{ errors.nationality }}</small>
      </div>
      <div class="flex mt-2 flex-col w-75">
        <Password
          v-model="password"
          v-bind="passwordAttrs"
          toggle-mask
          placeholder="Choose a Password"
        />
        <small v-if="errors.password" class="text-red-400">{{ errors.password }}</small>
      </div>
      <div class="flex mt-2 flex-col w-75">
        <Password
            v-model="passwordConfirmation"
            v-bind="passwordConfirmationAttrs"
            :feedback="false"
            toggle-mask
            placeholder="Confirm Your Password"
        />
        <small v-if="passwordError" class="text-red-400">{{ passwordError }}</small>
      </div>
      <Button
        class="w-75 mt-2"
        label="Sign Up"
        type="submit"
      />
<!--        :disabled="disableSubmit"-->
    </Form>
  </Fieldset>
</template>
<style scoped>
::v-deep .p-password-input {
  width: 100%
}
</style>