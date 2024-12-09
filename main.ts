import { S3Client } from "@bradenmacdonald/s3-lite-client";
import { join } from "@std/path/join";

export const getS3Uri = (key: string) =>
  new URL(key, Deno.env.get("S3_PUBLIC_URL")!);

export const s3Client = new S3Client({
  accessKey: Deno.env.get("S3_ACCESS_KEY_ID")!,
  secretKey: Deno.env.get("S3_SECRET_ACCESS_KEY")!,
  endPoint: Deno.env.get("S3_ENDPOINT_URL")! ??
    "error.eu.r2.cloudflarestorage.com",
  region: Deno.env.get("S3_BUCKET_REGION")!,
  bucket: Deno.env.get("S3_DEFAULT_BUCKET")!,
  useSSL: true,
  pathStyle: true,
});

await Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null);
  }

  const url = new URL(req.url);
  if (url.pathname.startsWith("/gun")) {
    const key = url.searchParams.get("key");
    const s3key = key ? join("gun", "care-fiction-1", key) : null;
    if (req.method === "PUT" && s3key) {
      const url = await s3Client.getPresignedUrl("PUT", s3key, {
        expirySeconds: 60 * 3,
      });
      return new Response(url);
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
