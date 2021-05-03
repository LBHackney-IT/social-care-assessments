import { Formik, Form } from "formik"
import { Field } from "../config/forms.types"
import { AutosaveTrigger } from "../contexts/autosaveContext"
import { generateFlexibleSchema } from "../lib/validators"
import FlexibleField from "./FlexibleFields"
import { Person } from "../lib/socialCareApi.types"
import Link from "next/link"
import Banner from "./Banner"
import { generateInitialValues } from "../lib/helpers"
import { useRouter } from "next/router"

type InitialValue = string | string[]

interface Props {
  fields: Field[]
  person: Person
  initialValues?: InitialValue[]
  onFinish: (values, any) => void
  onSubmit: (values, any) => void
  singleStep?: boolean
}

const StepForm = ({
  initialValues,
  fields,
  person,
  onSubmit,
  onFinish,
  singleStep,
}: Props): React.ReactElement => {
  const router = useRouter()

  return (
    <Formik
      initialValues={initialValues || generateInitialValues(fields, person)}
      validationSchema={generateFlexibleSchema(fields)}
      onSubmit={onSubmit}
    >
      {({
        values,
        isSubmitting,
        setSubmitting,
        touched,
        errors,
        setStatus,
        status,
        submitForm,
        isValid,
      }) => (
        <>
          <Form>
            {status && (
              <Banner
                title="There was a problem saving your answers"
                className="lbh-page-announcement--warning"
              >
                <p>Please refresh the page or try again later.</p>
                <p className="lbh-body-xs">{status}</p>
              </Banner>
            )}

            {fields.map(field => (
              <FlexibleField
                key={field.id}
                field={field}
                touched={touched}
                errors={errors}
                values={values}
              />
            ))}

            <AutosaveTrigger />

            <button
              className="govuk-button lbh-button"
              disabled={isSubmitting}
              onClick={async () => {
                await submitForm()
                if (singleStep) {
                  setSubmitting(true)
                  onFinish(values, { setStatus })
                } else {
                  if (isValid && !isSubmitting)
                    router.push(`/submissions/${router.query.id}`)
                }
              }}
            >
              {singleStep ? "Save and finish" : "Save changes"}
            </button>
          </Form>
        </>
      )}
    </Formik>
  )
}

export default StepForm
