const limitString = (text, size) => {
  if (typeof text != "string") return "";

  return text.length > size ? `${text.substring(0, size)}...` : text;
};

export default { limitString };
