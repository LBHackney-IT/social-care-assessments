import { Form, Step } from "../config/forms.types"

export interface Theme {
  name: string
  steps: Step[]
}

/** Take a form's steps and organise them by theme for displaying in a task list */
export const groupByTheme = (form: Form): Theme[] =>
  form.steps.reduce(function (groups, step) {
    const name = step.theme
    if (!groups.find(group => group.name === name)) {
      groups.push({
        name: name,
        steps: [],
      })
    }
    const group = groups.find(group => group.name === name)
    group.steps.push(step)
    return groups
  }, [])

/** Take form data and turn it into the format SelectField expects  */
export const formsToChoices = (
  forms: Form[]
): {
  value: string
  label: string
}[] =>
  forms.map(form => ({
    value: form.id,
    label: form.name,
  }))

/** Push an element into an array, without duplicates */
export const pushUnique = (array: string[], newElement: string): string[] => [
  ...new Set(array).add(newElement),
]

/** Throttle calling a function to at most once during the given delay */
export const debounce = (func: () => any, delay: number): (() => any) => {
  let debounceTimer
  return function () {
    const context = this
    const args = arguments
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => func.apply(context, args), delay)
  }
}

/** Generate flexible initial values for a flexible schema */
export const generateInitialValues = (fields, person): any => {
  const initialValues = {}
  fields.map(field => {
    if (field.type === "checkboxes" || field.type === "repeater") {
      initialValues[field.id] = []
    } else {
      initialValues[field.id] = (person && person[field.prefill]) || ""
    }
  })
  return initialValues
}
