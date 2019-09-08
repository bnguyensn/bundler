/**
 * This Web Worker simply echoes back all messages it receives, but in ALL
 * CAPS!.
 */

addEventListener('message', e => {
  postMessage(e.data.toUpperCase() + '!');
  console.log(
    `Received ${e.data} from main thread. Posted ${e.data} to main thread`,
  );
});
