import {
  groupByTheme,
  formsToChoices,
  pushUnique,
  debounce,
  generateInitialValues,
} from "./helpers"

const form = {
  id: "1",
  name: "Example form",
  steps: [
    {
      id: "1",
      name: "First example step",
      fields: [],
      theme: "First theme",
    },
    {
      id: "2",
      name: "Second example step",
      fields: [],
      theme: "First theme",
    },
    {
      id: "3",
      name: "Second example step",
      fields: [],
      theme: "Second theme",
    },
  ],
}

describe("groupByTheme", () => {
  it("themes things correctly", () => {
    const result = groupByTheme(form)
    expect(result[0].name).toEqual("First theme")
    expect(result[0].steps.length).toEqual(2)
    expect(result[1].name).toEqual("Second theme")
    expect(result[1].steps.length).toEqual(1)
  })
})

describe("formsToChoices", () => {
  it("converts correctly", () => {
    const result = formsToChoices([form, form])
    expect(result).toEqual([
      {
        value: "1",
        label: "Example form",
      },
      {
        value: "1",
        label: "Example form",
      },
    ])
  })
})

describe("pushUnique", () => {
  it("removes duplicates", () => {
    const result = pushUnique(["one", "two", "three", "three"], "three")
    expect(result).toEqual(["one", "two", "three"])
  })

  it("leaves arrays without duplicates alone", () => {
    const result = pushUnique(["one", "two", "three", "four"], "five")
    expect(result).toEqual(["one", "two", "three", "four", "five"])
  })
})

describe("debounce", () => {
  jest.useFakeTimers()

  let func: jest.Mock
  let debouncedFunc

  beforeEach(() => {
    func = jest.fn()
    debouncedFunc = debounce(func, 1000)
  })

  it("executes only after a delay", () => {
    for (let i = 0; i < 100; i++) {
      debouncedFunc()
    }

    expect(func).toHaveBeenCalledTimes(0)

    jest.runAllTimers()

    expect(func).toBeCalledTimes(1)
  })
})

describe("generateInitialValues", () => {
  it("correctly handles different field types", () => {
    const result = generateInitialValues(
      [
        {
          id: "one",
          question: "",
          type: "text",
        },
        {
          id: "two",
          question: "",
          type: "checkboxes",
        },
        {
          id: "three",
          question: "",
          type: "repeater",
        },
        {
          id: "four",
          question: "",
          type: "file",
        },
        {
          id: "five",
          question: "",
          type: "select",
          choices: [
            {
              value: "blah",
              label: "",
            },
          ],
        },
      ],
      null
    )

    expect(result).toMatchObject({
      one: "",
      two: [],
      three: [],
      four: null,
      five: "blah",
    })
  })

  it("prefills if there's data available", () => {
    const result = generateInitialValues(
      [
        {
          id: "foo",
          question: "",
          type: "text",
          prefill: "one",
        },
        {
          id: "bar",
          question: "",
          type: "text",
          prefill: "two",
        },
      ],
      { one: "example value" } as any
    )

    expect(result).toMatchObject({
      foo: "example value",
      bar: "",
    })
  })

  it("can be used recursively for repeater groups", () => {
    const result = generateInitialValues(
      [
        {
          id: "foo",
          question: "",
          type: "repeaterGroup",
          subfields: [
            {
              id: "one",
              question: "",
              type: "text",
            },
          ],
        },
      ],
      null
    )

    expect(result).toMatchObject({
      foo: [
        {
          one: "",
        },
      ],
    })
  })
})
