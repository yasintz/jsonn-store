function appError(message: string) {
  return { message };
}

function dbError(message: string) {
  return { message };
}

export { appError, dbError };
