export default function spawnNewWorker() {
  if (window.Worker) {
    return new Worker('./workerThread.js', { type: 'module' });
  }

  return null;
}
