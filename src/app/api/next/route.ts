import {getNext, putAnswer} from "@/service";

interface Body {
  uid: string;
  qid: string;
  answer: string;
}

export async function POST(
    req: Request,
) {
  const body: Body = await req.json();
  console.log('BODY: ', body);
  if (body.qid && body.answer) {
    await putAnswer(body.uid, body.qid, body.answer);
  }
  const { id, data } = await getNext(body.uid);
  return Response.json({
    qid: id,
    image: Buffer.from(data).toString('base64'),
  })
}