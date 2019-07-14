import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import spawnNewWorker from '../web-worker/mainThread';

export default function Worker() {
  const [input, setInput] = useState('');
  const workerRef = useRef(null);
  const [workerResponse, setWorkerResponse] = useState('');

  useEffect(() => {
    const worker = spawnNewWorker();

    if (worker) {
      workerRef.current = worker;

      workerRef.current.onmessage = e => {
        setWorkerResponse(e.data);
        console.log(`Received ${e.data} from Web Worker.`);
      };

      workerRef.current.onmessage = e => {
        setWorkerResponse(e.data);
        console.log(`Received ${e.data} from Web Worker.`);
      };

      workerRef.current.onerror = err => {
        setWorkerResponse(
          `Error: ${err.message} ` +
            `occurred in ${err.filename} ` +
            `at line ${err.lineno}`,
        );
        console.error('Web Worker ran into an error.');
      };
    }

    return () => {
      if (worker) worker.terminate();
    };
  }, []);

  const handleInputUpdate = e => {
    setInput(e.target.value);
  };

  const handleWorkerButtonClick = () => {
    workerRef.current.postMessage(input);
  };

  return (
    <div className="worker">
      {window.Worker ? (
        <>
          <input
            name="workerInput"
            type="text"
            value={input}
            onChange={handleInputUpdate}
          />
          <div>Response from Web Worker: {workerResponse}</div>
          <Button onClick={handleWorkerButtonClick}>Run WebWorker</Button>
        </>
      ) : (
        <div>Your browser does not support Web Worker 😔</div>
      )}
    </div>
  );
}
