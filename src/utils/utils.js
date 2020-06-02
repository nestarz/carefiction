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
