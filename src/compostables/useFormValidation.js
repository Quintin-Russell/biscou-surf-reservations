import { ref, computed } from "vue"
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'

/**
 *
 * @param schema - a Yup validation schema (defines rules for each field)
 * @param initialValues - starting values for form fields (optional)
 * @returns {Object} - Form state and methods for validation
 */
export function useFormValidation(schema, initialValues = {}) {
  const {
    errors,
    handleSubmit,
    defineField,
    resetForm,
    validate,
    values,
    meta
  } = useForm({
    validationSchema: toTypedSchema(schema),
    initialValues,
  })

  // refs
  const isSubmitting = ref(false)
  const submitError = ref(null)

  // computed
  const isValid = computed(() => meta.value.valid)
  const isDirty = computed(() => meta.value.dirty)

  // methods
  const validateForm = async () => {
    return await validate()
  }
  const getValues = () => {
    return { ...values }
  }
  const onSubmit = async function(callback) {
    return handleSubmit(async (values) => {
      try {
        isSubmitting.value = true
        submitError.value = null
        await callback(values)
      } catch(e) {
        console.error('Error submitting a form: ', e)
        submitError.value = 'Something went wrong'
        throw e
      } finally {
        isSubmitting.value = false
      }
    })
  }

  const reset = () => {
    resetForm()
    submitError.value = null
  }

  return {
    errors,
    isSubmitting,
    submitError,
    isValid,
    isDirty,
    defineField,
    onSubmit,
    reset,
    getValues,
    validateForm
  }
}