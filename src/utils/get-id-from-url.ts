export const getIdFromUrl = (url: string) =>
  url
    .split('/')
    .filter((c) => !!c)
    .at(2);
