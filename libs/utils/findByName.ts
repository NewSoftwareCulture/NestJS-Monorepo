export const findByName = (array: any[], name: string) =>
  array.filter((el) => el.name).find((el) => el.name === name);
