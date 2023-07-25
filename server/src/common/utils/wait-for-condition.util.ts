export const waitForCondition = (
  generateConditionFunc: () => boolean,
  ms = 100,
) => {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (generateConditionFunc()) {
        clearInterval(interval);
        resolve(true);
      }
    }, ms);
  });
};
