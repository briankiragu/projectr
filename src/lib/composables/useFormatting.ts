export default () => {
  const toTitleCase = (phrase?: string) =>
    phrase
      ? phrase
          .toLowerCase()
          .replace(/-/g, ' ')
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
      : null;

  return {
    toTitleCase,
  };
};
