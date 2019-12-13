import { Request } from 'express';

function generateApiLink(req: Request, id?: string, isPublic = false) {
  const apiUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`).origin;
  const url = new URL(`${isPublic ? '' : '/api'}/json/${id || ''}`, apiUrl).href;

  return url;
}
function generateViewLink(req: Request, id?: string) {
  const apiUrl = new URL(`${req.protocol}://${req.get('host')}${req.originalUrl}`).origin;
  const url = new URL(id ? `?id=${id}` : '', apiUrl).href;

  return url;
}

export { generateApiLink, generateViewLink };
