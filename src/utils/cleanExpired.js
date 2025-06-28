export const removeExpiredLinks = () => {
  const links = JSON.parse(localStorage.getItem("shortLinks")) || [];
  const now = new Date();

  const filtered = links.filter(link => new Date(link.expiry) > now);
  localStorage.setItem("shortLinks", JSON.stringify(filtered));
  return filtered;
};
