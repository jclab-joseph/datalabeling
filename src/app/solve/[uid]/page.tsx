"use client";

import {useEffect, useState} from "react";
import useFetchNext from "@/hook/useFetchNext";
import {useSearchParams} from "next/navigation";
import styles from './page.module.css';

export default function Home({ params }: { params: { uid: string }}) {
  const search = useSearchParams()

  const uid = params.uid;
  const qid = search.get('qid') || '';

  const {
    count, imageSrc, answer, next, error
  } = useFetchNext(uid, qid);

  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const updateInput = (v: string) => {
    setInputValue(v);
    setErrorMessage('');
  }

  const handleSubmit = () => {
    if (inputValue.length === 6 || inputValue.length === 0) {
      const cur = inputValue;
      setInputValue('');
      next(cur);
    } else {
      setErrorMessage('6자리 숫자를 입력해주세요.');
    }
  };

  const handleKeyDown = (key: string) => {
    if (key === 'Enter') {
      handleSubmit();
    }
  }

  useEffect(() => {
    if (error && !errorMessage) {
      setErrorMessage(`${error}`);
    }
  }, [error]);

  useEffect(() => {
    setInputValue(answer);
  }, [answer]);


  return (
      <div className="app">
        <div className={styles.container}>
          COUNT: {count}
        </div>
        <div className={styles.container}>
          <img src={imageSrc} alt="그림" className={styles.image}/>
        </div>
        <div className={styles.container}>
          <input
              type="number"
              value={inputValue}
              onChange={(e) => updateInput(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e.key)}
              className={styles.input}
              placeholder="6자리 숫자를 입력하세요"
          />
          <button onClick={handleSubmit} className={styles.button}>
            다음
          </button>
        </div>
        <div>
          {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        </div>
      </div>
  );
}
