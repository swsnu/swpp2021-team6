import humps from 'humps';

export const { kakao } = window as any;

declare global {
  interface Window {
    kakao: any;
  }
}

export const getKakaoMap = (
  container: any,
  lat: number,
  lng: number,
  setCenter: any,
  setSelectedPlace?: any,
  keyword?: string,
) => {
  const options = {
    center: new window.kakao.maps.LatLng(lat, lng),
    level: 3,
  };
  const map = new window.kakao.maps.Map(container, options);

  window.kakao.maps.event.addListener(map, 'dragend', () => {
    setCenter(map.getCenter());
  });

  if (keyword) {
    const infowindow = new window.kakao.maps.InfoWindow({ zIndex: 1 });
    const displayMarker = (result: any) => {
      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(result.y, result.x),
      });
      window.kakao.maps.event.addListener(marker, 'click', () => {
        setSelectedPlace(humps.camelizeKeys(result));
        infowindow.setContent(
          `<div style="padding:5px;font-size:12px;">${result.place_name}</div>`,
        );
        infowindow.open(map, marker);
      });
    };

    const placesSearchCB = (data: any, status: any, pagination: any) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const bounds = new window.kakao.maps.LatLngBounds();
        for (let i = 0; i < data.length; i++) {
          displayMarker(data[i]);
          bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
        }
        map.setBounds(bounds);
      } else if (status === 'ZERO_RESULT') {
        alert('검색 결과가 없습니다. 다른 키워드로 검색해주세요.');
      }
    };

    const ps = new window.kakao.maps.services.Places();
    ps.keywordSearch(keyword, placesSearchCB, {
      x: lng,
      y: lat,
      radius: 5000,
      sort: 'distance',
    });
  }
};

export const getKakaoMapWithMarker = (
  container: any,
  lat: number,
  lng: number,
) => {
  const options = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3,
  };
  const map = new kakao.maps.Map(container, options);

  const marker = new kakao.maps.Marker({
    position: new kakao.maps.LatLng(lat, lng),
  });

  marker.setMap(map);
};
