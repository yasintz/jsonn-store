import { Request } from 'express';
const httpsProtocol = process.env.NODE_ENV === 'development' ? 'http://' : 'https://';
function generateApiLink(req: Request, id?: string) {
  const originUrl = new URL(req.protocol + '://' + req.get('host') + req.originalUrl).origin;
  const apiUrl = originUrl.replace('http://', httpsProtocol);
  const url = new URL(`/api/json/${id ? id : ''}`, apiUrl).href;
  return url;
}
function generateViewLink(req: Request, id?: string) {
  const originUrl = new URL(req.protocol + '://' + req.get('host') + req.originalUrl).origin;
  const apiUrl = originUrl.replace('http://', httpsProtocol);
  const url = new URL(id ? `/json/${id}` : '', apiUrl).href;
  return url;
}

export { generateApiLink, generateViewLink };
