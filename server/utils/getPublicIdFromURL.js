export const getPublicIdFromUrl = (url) => {
  const parts = url.split('/');
  const fileWithExtension = parts[parts.length - 1];
  const publicId = fileWithExtension.split('.')[0]; // remove extension
  return parts.slice(parts.length - 2, parts.length - 1)[0] + '/' + publicId; // folder/filename
};