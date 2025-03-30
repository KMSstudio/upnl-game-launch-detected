/* @/app/api/download/upnl/route.js */

/*
* Handles the POST request for downloading files from UPnL.
* Sends a GET request with the given session cookie and returns the file response.
*
* Requires:
* - session: the session cookie value
* - url: the file download URL
*/
export async function POST(req) {
  const formData = await req.formData();
  const session = formData.get('session');
  const url = formData.get('url');

  try {
    const res = await fetch(url, {
      headers: {
        Cookie: `session=${session}`,
        'User-Agent': 'Mozilla/5.0',
        'Referer': url
      }
    });

    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get('content-type') || 'application/octet-stream';
    const contentDisposition =
      res.headers.get('content-disposition') || 'attachment; filename="downloaded.file"';

    return new Response(buffer, {
      status: res.status,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': contentDisposition,
      },
    });
  } catch (err) {
    return new Response('Fail to request: ' + err.message, { status: 500 });
  }
}