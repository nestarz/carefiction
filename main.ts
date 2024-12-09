import { openKvToolbox } from "@kitsonk/kv-toolbox";

const kv = await openKvToolbox();

await Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null);
  }

  const url = new URL(req.url);
  if (url.pathname.startsWith("/gun")) {
    const key = url.searchParams.get("key") as keyof typeof kv;
    if (req.method === "GET") {
      const stream = await kv.getBlob(["gun", "care-fiction-8", key]);
      if (stream.value) return new Response(stream.value);
    }
    if (req.method === "PUT") {
      await kv.setBlob(
        ["gun", "care-fiction-8", key],
        new Blob([await req.blob()], { type: "text/plain" }),
      );
      return new Response(null);
    }
    return new Response(null, { status: 404 });
  }

  if (req.method === "GET") {
    return fetch(
      import.meta.resolve(
        req.headers.get("accept")?.toLowerCase().includes("text/html") &&
          url.pathname.split(".").at(-1) !== "json"
          ? "./index.html"
          : "." + url.pathname,
      ),
    );
  }
  return new Response(null, { status: 404 });
}).finished;
