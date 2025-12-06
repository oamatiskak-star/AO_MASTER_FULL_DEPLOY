export function log(message) {
  const time = new Date().toISOString();
  console.log("LOG", time, message);
}

export function logError(message) {
  const time = new Date().toISOString();
  console.error("ERROR", time, message);
}
