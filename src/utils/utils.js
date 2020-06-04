export const classs = (...args) =>
  args
    .flatMap((object) =>
      object
        ? typeof object === "string"
          ? object
          : Object.entries(object).reduce(
              (str, [name, bool]) => (bool && name ? [...str, name] : str),
              []
            )
        : null
    )
    .filter((v) => v)
    .join(" ");

export const formatDate = (date) => {
  const d = typeof date === "string" ? Date.parse(date) : date;
  const ye = new Intl.DateTimeFormat("en", { year: "numeric" }).format(d);
  const mo = new Intl.DateTimeFormat("en", { month: "short" }).format(d);
  const da = new Intl.DateTimeFormat("en", { day: "2-digit" }).format(d);
  return `${da} ${mo} ${ye}`;
};

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const byCreateAt = (
  { data: { createdAt: a } },
  { data: { createdAt: b } }
) => new Date(b) - new Date(a);

export const byCount = ({ data: { count: a } }, { data: { count: b } }) =>
  a - b;

export const getSizeKo = (b64) => (b64.length * (3 / 4)) / 1000;

export const compressImage = (base64, type) => {
  const canvas = document.createElement("canvas");
  const img = document.createElement("img");
  const clean = () => Object.assign(canvas, { width: 0, height: 0 });
  return new Promise((resolve, reject) => {
    img.onload = function () {
      let width = img.width;
      let height = img.height;
      const maxHeight = 600;
      const maxWidth = 600;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height *= maxWidth / width));
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width *= maxHeight / height));
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      const res = canvas.toDataURL(type, 0.8);
      getSizeKo(res) > 300
        ? resolve(canvas.toDataURL("image/jpeg", 0.7))
        : resolve(res);
      clean();
    };
    img.onerror = function (err) {
      reject(err);
      clean();
    };
    img.src = base64;
  });
};
