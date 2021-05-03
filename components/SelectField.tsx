import { Field as RawField, ErrorMessage, getIn } from "formik"

interface FieldProps {
  touched
  errors
  name: string
  label: string
  type?: string
  hint?: string
  className?: string
  required?: boolean
  choices: {
    value: string
    label: string
  }[]
}

const Field = ({
  touched,
  errors,
  name,
  label,
  hint,
  className,
  choices,
  ...props
}: FieldProps): React.ReactElement => (
  <div
    className={`govuk-form-group lbh-form-group ${
      getIn(touched, name) && getIn(errors, name) && "govuk-form-group--error"
    }`}
  >
    <label htmlFor={name} className="govuk-label lbh-label">
      {label}
    </label>

    {hint && (
      <span id={`${name}-hint`} className="govuk-hint lbh-hint">
        {hint}
      </span>
    )}

    <ErrorMessage name={name}>
      {msg => (
        <p className="govuk-error-message lbh-error-message" role="alert">
          <span className="govuk-visually-hidden">Error:</span>
          {msg}
        </p>
      )}
    </ErrorMessage>

    <RawField
      as="select"
      name={name}
      id={name}
      aria-describedby={hint ? `${name}-hint` : false}
      className={`govuk-select lbh-select ${className}`}
      {...props}
    >
      {choices.map(choice => (
        <option value={choice.value} key={choice.value}>
          {choice.label}
        </option>
      ))}
    </RawField>
  </div>
)

export default Field
