'use client';

import { useRef, useState } from 'react';

export default function DownloadPage() {
  const formRef = useRef(null);
  const [session, setSession] = useState('');
  const [url, setUrl] = useState('');

  const handleSubmit = () => {
    formRef.current.submit();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>파일 다운로드</h1>

      <form
        ref={formRef}
        method="POST"
        action="/api/download/upnl"
        target="_blank"
      >
        <label>Session 값:</label><br />
        <input
          type="text"
          name="session"
          value={session}
          onChange={(e) => setSession(e.target.value)}
        /><br /><br />

        <label>Download URL:</label><br />
        <input
          type="text"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        /><br /><br />

        <button type="button" onClick={handleSubmit}>제출 및 다운로드</button>
      </form>
    </div>
  );
}
