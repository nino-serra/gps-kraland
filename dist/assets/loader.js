const chunkCount = 9;
const basePath = "/gps-kraland/assets/chunks/";
const code = await Promise.all(
  Array.from({ length: chunkCount }, (_, index) =>
    fetch(`${basePath}app.${String(index).padStart(2, "0")}.txt`).then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to load app chunk ${index}`);
      }
      return response.text();
    }),
  ),
);
const appUrl = URL.createObjectURL(new Blob([code.join("")], { type: "text/javascript" }));
await import(appUrl);
