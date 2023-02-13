export const capitalizeFirstLetter = (str: String) => {
  const capitalized = str.charAt(0).toUpperCase() + str.slice(1);
  return capitalized;
};
