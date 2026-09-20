export async function onRequest(context) {
  const { params, env, request } = context;
  const slug = params.slug;

  // Fetch the raw content file from GitHub
  const rawUrl = `https://raw.githubusercontent.com/John0ogletree/Explained/main/topics/${slug}.md`;
  const res = await fetch(rawUrl);

  if (!res.ok) {
    return new Response("Topic not found", { status: 404 });
  }

  const raw = await res.text();
  const bodyHtml = renderMarkdown(raw);

  const title = slug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — Explained</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      max-width: 720px;
      margin: 2rem auto;
      padding: 0 1rem;
      line-height: 1.7;
      color: #e2e8f0;
      background: #0f172a;
    }
    a { color: #93c5fd; }
    pre { background: #1e293b; padding: 1rem; border-radius: 8px; overflow-x: auto; }
    code { background: #1e293b; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    h1, h2, h3 { color: #fcd34d; }
  </style>
</head>
<body>
  <a href="/">← Back to topics</a>
  <h1>${title}</h1>
  <article>${bodyHtml}</article>

  <div id="jao-support"></div>
  <script src="https://support.jao.life/support.js"></script>
</body>
</html>`;

  return new Response(html, {
    headers: { "Content-Type": "text/html;charset=UTF-8" },
  });
}

// Tiny markdown renderer — swap for a real one if you want
function renderMarkdown(md) {
  return md
    .replace(/^### (.*$)/gim, "<h3>$1</h3>")
    .replace(/^## (.*$)/gim, "<h2>$1</h2>")
    .replace(/^# (.*$)/gim, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, "</p><p>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>");
}
