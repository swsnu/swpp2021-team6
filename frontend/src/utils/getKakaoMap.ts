export const { kakao } = window as any;

declare global {
  interface Window {
    kakao: any;
  }
}

export const getKakaoMap = (lat: number, lng: number) => {
  const container = document.getElementById('map');
  const options = {
    center: new window.kakao.maps.LatLng(lat, lng),
    level: 3,
  };
  const map = new window.kakao.maps.Map(container, options);
};
