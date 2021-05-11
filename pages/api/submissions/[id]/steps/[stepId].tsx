import prisma from "../../../../../lib/prisma"
import { NextApiResponse } from "next"
import forms from "../../../../../config/forms"
import { getPersonById } from "../../../../../lib/socialCareApi"
import { pushUnique } from "../../../../../lib/helpers"
import { generateFlexibleSchema } from "../../../../../lib/validators"
import {
  apiHandler,
  ApiRequestWithSession,
} from "../../../../../lib/apiHelpers"

const handler = async (req: ApiRequestWithSession, res: NextApiResponse) => {
  const { id, stepId } = req.query

  // 1. grab submission
  const submission = await prisma.submission.findUnique({
    where: {
      id: id.toString(),
    },
  })

  // 2. grab this particular step from the form
  const form = forms.find(form => form.id === submission.formId)
  const step = form.steps.find(step => step.id === stepId)

  if (!step)
    res.status(404).json({
      error: "Step not found",
    })

  if (req.method === "PATCH") {
    const values = JSON.parse(req.body)

    await generateFlexibleSchema(step.fields).validate(values)

    const updatedAnswers = submission.answers || {}
    updatedAnswers[stepId.toString()] = values

    // // get the last revision, if it exists
    // const lastRevision = await prisma.revision.findFirst({
    //   where: {
    //     submissionId: id.toString(),
    //   },
    //   orderBy: {
    //     createdAt: "desc",
    //   },
    // })

    const completedSteps = pushUnique(
      submission.completedSteps,
      stepId.toString()
    )

    const updatedSubmission = await prisma.submission.update({
      where: {
        id: id.toString(),
      },
      data: {
        answers: updatedAnswers,
        editedBy: pushUnique(submission.editedBy, req.session.user.email),
        completedSteps,
        Revision: {
          create: [
            {
              createdBy: req.session.user.email,
              completedSteps,
            },
          ],
        },
      },
    })

    res.json({
      submission: updatedSubmission,
    })
  } else {
    // 3. grab person
    const person = await getPersonById(submission.socialCareId.toString())

    res.json({
      ...submission,
      // include the answers for this step
      stepAnswers: submission.answers[stepId.toString()],
      form,
      step,
      person,
    })
  }
}

export default apiHandler(handler)
