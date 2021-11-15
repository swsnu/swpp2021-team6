import axios from 'axios';

const getGuDong = async (x: number, y: number) => {
  const result = { gu: '', dong: '' };

  try {
    const response = await axios({
      method: 'GET',
      url: 'https://dapi.kakao.com/v2/local/geo/coord2regioncode.json',
      headers: {
        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_MAP_REST_API_KEY}`,
      },
      params: {
        x,
        y,
      },
    });
    const { region_2depth_name, region_3depth_name } =
      response.data.documents[0];
    result.gu = region_2depth_name;
    result.dong = region_3depth_name;
  } catch {
    console.log('행정구역정보를 불러오는 중 문제가 발생했습니다.');
  }
  return result;
};

export default getGuDong;
