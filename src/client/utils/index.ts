function isServer() {
  return typeof window === 'undefined';
}

export { isServer };
