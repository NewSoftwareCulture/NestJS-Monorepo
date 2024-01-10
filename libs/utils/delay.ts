export const delay = async (ms: number = 0): Promise<number> =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve(ms);
    }, ms),
  );
