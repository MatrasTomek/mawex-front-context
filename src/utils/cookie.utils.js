export const setCookie = () => {
  const data = new Date();
  const days = 21;
  data.setTime(data.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `accessForMawex; path=/; expires=${data}`;
};
