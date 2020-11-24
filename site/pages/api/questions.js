const config = require('../../next.config');

async function handleGetPaginatedQuestions(order, offset, limit, langUsed, res) {
  if (!parseInt(offset, 10) || !parseInt(limit, 10)) {
    res.status(400).json({ msg: 'Offset and limit are integers' });
    return;
  }
  if (!['frequency'].includes(order)) {
    res.status(400).json({ msg: 'Order should be one of [frequency]' });
    return;
  }

  const offsetUsed = Math.max(offset, 0);
  let limitUsed = Math.max(offset, 0);
  limitUsed = Math.min(limitUsed, 30);

  const db = require('../../lib/db').instance;

  const query = `select title, 
                      body, 
                      ownerdisplayname, 
                      owneruserid,
                      upvotecount,
                      downvotecount
               from Posts
               where posttypeid = 1
               order by viewcount desc
               offset $1
               limit $2`;

  const questions = await db.any(query, [offsetUsed, limitUsed]);

  const data = {
    meta: {
      total: 1000,
    },
    questions,
  };

  res.status(200).json(data);
}

export default async function handler(req, res) {
  const {
    query: {
      order, limit, offset, lang,
    },
  } = req;

  const langUsed = config.i18n.locales.includes(lang) ? lang : config.i18n.defaultLocale;

  if (order && limit && offset) {
    await handleGetPaginatedQuestions(order, offset, limit, langUsed, res);
  } else {
    res.status(400).json({ msg: 'Request is ill-formed.' });
  }
}
