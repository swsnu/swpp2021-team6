// export const mockNavigatorGeolocation = () => {
//   const getCurrentPositionMock = jest.fn();

//   const geolocation = {
//     getCurrentPosition: getCurrentPositionMock,
//   };

//   Object.defineProperty(global.navigator, 'geolocation', {
//     value: geolocation,
//   });

//   return { getCurrentPositionMock };
// };

export const mockNavigatorGeolocation = () => {
  const clearWatchMock = jest.fn();
  const getCurrentPositionMock = jest.fn();
  const watchPositionMock = jest.fn();

  const geolocation = {
    clearWatch: clearWatchMock,
    getCurrentPosition: getCurrentPositionMock,
    watchPosition: watchPositionMock,
  };

  Object.defineProperty(global.navigator, 'geolocation', {
    value: geolocation,
    configurable: true,
  });

  return { clearWatchMock, getCurrentPositionMock, watchPositionMock };
};
