import TextField from "./TextField"
import RadioField from "./RadioField"
import CheckboxField from "./CheckboxField"
import SelectField from "./SelectField"
import RepeaterField from "./RepeaterField"
import RepeaterGroupField from "./RepeaterGroupField"
import FileUploadField from "./FileUploadField"
import ComboboxField from "./ComboboxField"

const FlexibleField = ({
  values,
  field,
  touched,
  errors,
}): React.ReactElement => {
  if (field.condition && values[field.condition.id] !== field.condition.value)
    return null

  // if (field.type === "file")
  //   return (
  //     <FileUploadField
  //       name={field.id}
  //       label={field.question}
  //       touched={touched}
  //       errors={errors}
  //       {...field}
  //     />
  //   )

  if (field.type === "repeaterGroup")
    return (
      <RepeaterGroupField
        name={field.id}
        subfields={field.subfields}
        label={field.question}
        touched={touched}
        errors={errors}
        {...field}
      />
    )

  if (field.type === "textarea")
    return (
      <TextField
        name={field.id}
        label={field.question}
        touched={touched}
        errors={errors}
        as="textarea"
        rows={3}
        {...field}
      />
    )

  if (field.type === "text")
    return (
      <TextField
        name={field.id}
        label={field.question}
        touched={touched}
        errors={errors}
        {...field}
      />
    )

  if (field.type === "repeater")
    return (
      <RepeaterField
        name={field.id}
        label={field.question}
        touched={touched}
        errors={errors}
        {...field}
      />
    )

  if (field.type === "checkboxes")
    return (
      <CheckboxField
        name={field.id}
        label={field.question}
        touched={touched}
        choices={field.choices}
        errors={errors}
        {...field}
      />
    )

  if (field.type === "combobox")
    return (
      <ComboboxField
        name={field.id}
        label={field.question}
        touched={touched}
        choices={field.choices}
        errors={errors}
        {...field}
      />
    )

  if (field.type === "select")
    return (
      <SelectField
        name={field.id}
        label={field.question}
        touched={touched}
        choices={field.choices}
        errors={errors}
        {...field}
      />
    )

  if (field.type === "radios")
    return (
      <RadioField
        name={field.id}
        label={field.question}
        touched={touched}
        choices={field.choices}
        errors={errors}
        {...field}
      />
    )

  return <p>Unsupported field</p>
}

export default FlexibleField
