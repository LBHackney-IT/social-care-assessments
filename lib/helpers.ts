import { Form, Step } from "../config/forms.types"

export interface Theme {
  name: string
  steps: Step[]
}

// take a form's steps and organise them by theme for displaying in a task list
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

// take form data and turn it into the format SelectField expects
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
