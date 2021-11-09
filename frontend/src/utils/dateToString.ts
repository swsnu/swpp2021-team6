const changeDateFormat = (str: string) => {
  const numArray = Array.from(str.matchAll(/[\d]+/g), (x) => x[0]);

  return `${numArray[0]}년 ${numArray[1]}월 ${numArray[2]}일 ${numArray[3]}:${numArray[4]}`;
};

export default changeDateFormat;
