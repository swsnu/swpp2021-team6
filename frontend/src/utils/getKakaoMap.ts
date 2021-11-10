import { kakao } from '../App';

export const getKakaoMap = (lat: number, lng: number) => {
  const container = document.getElementById('map');
  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3,
  };
  const map = new kakao.maps.Map(container, options);
};
