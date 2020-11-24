const config = require('../../../next.config');

async function handleGetQuestionById(id, lang, res) {
  if (!parseInt(id, 10)) {
    res.status(404).json({ msg: 'Question not found.' });
    return;
  }

  const db = require('../../../lib/db').instance;

  const r = await db.tx(async (t) => {
    const question = await t.any('select title, body, ownerdisplayname, owneruserid, acceptedanswerid, upvotecount, downvotecount from Posts where PostTypeId = 1 and Id = $1', [id]);
    const answers = await t.any('select body, ownerdisplayname, owneruserid, upvotecount, downvotecount from Posts where PostTypeId = 2 and ParentId = $1', [id]);
    return { question, answers };
  });

  if (r.question.length === 0) {
    res.status(404).json({ msg: 'Question not found.' });
    return;
  }

  const data = {
    question: r.question[0],
    answers: r.answers,
  };

  res.status(200).json(data);
}

export default async function handler(req, res) {
  const {
    query: {
      qid, lang,
    },
  } = req;

  const langUsed = config.i18n.locales.includes(lang) ? lang : config.i18n.defaultLocale;

  if (qid) {
    await handleGetQuestionById(qid, langUsed, res);
  } else {
    res.status(400).json({ msg: 'Request is ill-formed.' });
  }
}
