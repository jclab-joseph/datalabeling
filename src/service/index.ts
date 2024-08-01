import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

export async function getDb(): Promise<Database> {
  const newDb = await open({
    filename: 'D:\\jcworkspace\\nhis\\data-labeling.db',
    driver: sqlite3.Database,
  })
  await newDb.exec('PRAGMA journal_mode=WAL;');
  return newDb;
}

export async function putAnswer(uid: string, qid: string, answer: string) {
  // 1722516050
  const db = await getDb();
  const time = Math.floor(new Date().getTime() / 1000);

  try {
    await db.run(
        'INSERT OR REPLACE INTO `answer` (`uid`, `question_id`, `answer`, `created_at`) VALUES (?, ?, ?, ?);',
        uid, qid, answer, time
    );
  } finally {
    db.close()
  }
}

export async function getRandomQuery(db: Database, uid: string) {
  return await db.get(
      'SELECT question_id, data\n' +
      'FROM question\n' +
      'WHERE question_id NOT IN (SELECT question_id FROM answer WHERE uid = ?)' +
      'ORDER BY RANDOM()\n' +
      'LIMIT 1;',
      uid)
}

export async function getNext(uid: string) {
  const db = await getDb();
  try {
    const row = await db.get(
        'SELECT question_id, data\n' +
        'FROM question\n' +
        'WHERE question_id NOT IN (SELECT question_id FROM answer WHERE uid = ?)' +
        'ORDER BY RANDOM()\n' +
        'LIMIT 1;',
        uid)

    return {
      id: row.question_id,
      data: row.data,
    }
  } finally {
    db.close();
  }
}

export async function getQuestion(uid: string, qid: string) {
  const db = await getDb();
  try {
    // / 'INSERT OR REPLACE INTO `answer` (`uid`, `question_id`, `answer`, `created_at`) VALUES (?, ?, ?, ?);',
    const row = await db.get(
        'SELECT q.question_id, q.data, a.answer\n' +
        'FROM question q\n' +
        'LEFT JOIN answer a ON a.question_id = q.question_id\n' +
        'WHERE q.question_id = ?',
        qid);
    const countResult = await db.get(
        'SELECT COUNT(*) as `count` FROM answer WHERE answer.uid = ?', uid
    );
    return {
      id: row.question_id,
      data: Buffer.from(row.data).toString('base64'),
      answer: row.answer,
      count: countResult['count'] || 0,
    }
  } finally {
    db.close();
  }
}