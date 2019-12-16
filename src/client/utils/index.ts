function isServer() {
  return typeof window === 'undefined';
}

function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export { isServer, numberWithCommas };
