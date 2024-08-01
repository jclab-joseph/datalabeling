import axios, {AxiosError} from 'axios';
import {useEffect, useState} from "react";
import {useRouter, useSearchParams} from "next/navigation";

export interface GetNextBody {
  id: string;
  image: string;
}

export default function useFetchNext(uid: string, qid: string) {
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState<string>('');
  const [answer, setAnswer] = useState<string>('');
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<AxiosError | null>(null);

  function next(answer: string) {
    axios.post(
        '/api/next',
        {
          uid: uid,
          qid: qid,
          answer: answer,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
    )
        .then((resp) => {
          const { qid } = resp.data;
          if (qid) {
            router.push(location.href.replaceAll(/\?.+/g, '') + `?qid=${qid}`)
          }
        })
        .catch((err) => {
          setError(err);
        });
  }

  useEffect(() => {
    if (uid && !qid) {
      next('');
    }
  }, [uid, qid]);

  useEffect(() => {
    if (qid) {
      axios.get(`/api/question?uid=${uid}&qid=${qid}`)
          .then((resp) => {
            const { data, answer, count } = resp.data;
            setAnswer(answer || '');
            setImageSrc(`data:image/png;base64,${data}`)
            setCount(count)
          });
    } else {
      setImageSrc('')
    }
  }, [qid]);

  return { imageSrc, answer, count, error, next }
}