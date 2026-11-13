// One place for short messages that used to be alert() pop-ups. Any screen calls notify(); MessageHost (mounted once at
// the root of the app) shows it as a toast. Kept free of React Native imports so it can be unit tested.
//
//   notify("Couldn't reach the server.");              // an error (the default, stays a little longer)
//   notify('Your password has been changed.', 'success');
//
// The message outlives the screen that raised it, so it can be shown right before navigating away.

let listener = null;

export function notify(message, type = 'error') {
  if (listener && typeof message === 'string' && message) listener({ message, type });
}

// Registers the one listener (the host). Returns a function that removes it.
export function onNotify(fn) {
  listener = fn;
  return () => {
    if (listener === fn) listener = null;
  };
}
