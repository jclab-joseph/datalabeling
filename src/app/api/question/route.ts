import {getQuestion} from "@/service";
import { URL } from 'url';
import {Response} from "next/dist/compiled/@edge-runtime/primitives";
import {NextResponse} from "next/server";

export async function GET(
    req: Request,
) {
  const parsedUrl = new URL(req.url);
  const uid = parsedUrl.searchParams.get('uid')!!;
  const qid = parsedUrl.searchParams.get('qid')!!;
  const result = await getQuestion(uid, qid);
  return NextResponse.json(result);
}