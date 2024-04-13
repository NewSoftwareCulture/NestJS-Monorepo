export const retry = (callback, failCallback, count: number = 5) => {
  let triesCount = 1;

  return async function func(...params) {
    try {
      return await callback(...params);
    } catch (error) {
      if (triesCount >= count) return await failCallback(error, ...params);

      triesCount++;
      return await func(...params);
    }
  };
};
