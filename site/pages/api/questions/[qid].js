export default async function handler(req, res) {
  const {
    query: {qid},
  } = req

  if (!parseInt(qid)) {
    res.status(404).json({msg: "Question not found."})
  }

  const db = require('../../../lib/db').instance
  let r = await db.tx(async t => {
    const question = await db.any('select title, body from Posts where PostTypeId = 1 and Id = $1', [qid])
    const answers =  await db.any('select body from Posts where PostTypeId = 2 and ParentId = $1', [qid])
    return {question, answers}
  })

  if (r.question.length === 0) {
    res.status(404).json({msg: "Question not found."})
  }

  let data = {
    question: r.question[0],
    answers: r.answers
  }

  res.status(200).json(data)
}
