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
  as?: string
  rows?: number
}

const Field = ({
  touched,
  errors,
  name,
  type,
  label,
  hint,
  className,
  as,
  rows,
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
      name={name}
      id={name}
      type={type}
      className={`${
        as === "textarea"
          ? "govuk-textarea lbh-textarea"
          : "govuk-input lbh-input"
      } ${className}`}
      aria-describedby={hint && `${name}-hint`}
      as={as}
      rows={rows}
    />
  </div>
)

export default Field
