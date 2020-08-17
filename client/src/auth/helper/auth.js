export const isAuth = () => {
  if (localStorage.getItem("user")) return true;
  else return false;
};
