export const auth = async () => {
  return Promise.resolve({
    session: {
      user: {
        user_id: "test",
      },
    },
  });
};
