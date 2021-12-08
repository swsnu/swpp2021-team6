const changeMyPostDateFormat = (str: string) => {
  const numArray = Array.from(str.matchAll(/[\d]+/g), (x) => x[0]);

  return `${numArray[0]}.${numArray[1]}.${numArray[2]}ㆍ${numArray[3]}시`;
};

export default changeMyPostDateFormat;
