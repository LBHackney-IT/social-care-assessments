import React, {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react"
import { useFormikContext } from "formik"
import { debounce } from "../lib/helpers"
import s from "../styles/Autosave.module.scss"
import useWarnUnsavedChanges from "../hooks/useWarnUnsavedChanges"

const AutosaveContext = createContext(null)

export const AutosaveProvider = ({
  children,
}: {
  children: React.ReactChild
}): React.ReactElement => {
  const [saved, setSaved] = useState(true)
  const [saving, setSaving] = useState(true)

  return (
    <AutosaveContext.Provider value={{ saved, setSaved, saving, setSaving }}>
      {children}
    </AutosaveContext.Provider>
  )
}

export const AutosaveTrigger = ({
  delay = 1000,
}: {
  delay?: number
}): React.ReactElement => {
  const { saved, setSaved, saving, setSaving } = useContext(AutosaveContext)

  const { submitForm, validateForm, values, isSubmitting } = useFormikContext()

  // keep context in sync with submit status
  useEffect(() => {
    setSaving(!!isSubmitting)
  }, [isSubmitting])

  const debouncedSubmit = useCallback(
    debounce(() => {
      return submitForm().then(() => setSaved(true))
    }, delay),
    [submitForm, delay]
  )

  useWarnUnsavedChanges(!saved)

  useEffect(() => {
    setSaved(false)
    validateForm().then(errors => {
      if (Object.keys(errors).length === 0) {
        debouncedSubmit()
      }
    })
  }, [debouncedSubmit, values])

  return null
}

export const AutosaveIndicator = () => {
  const { saved, saving } = useContext(AutosaveContext)

  return (
    <div className={s.outer} role="status" aria-live="polite">
      {saving && (
        <img
          src="/spinner.svg"
          alt=""
          aria-hidden="true"
          className={s.spinner}
        />
      )}
      <p className={`lbh-body-s ${s.text}`}>
        {saved && !saving && "Changes saved"}
        {!saved && saving && "Saving changes..."}
        {!saved && !saving && "Unsaved changes"}
      </p>
    </div>
  )
}

export default AutosaveContext
