export const getStringSession = (session) => {
  return session + "";
};

export const asyncButtonListner = (id) => {
  return new Promise((resolve) => {
    document.getElementById(id)?.addEventListener("click", () => {
      console.log("cliked");
      resolve();
    });
  });
};
