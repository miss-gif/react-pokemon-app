import axios from "axios"; // axios를 사용해 API 호출을 처리합니다.
import React, { useEffect } from "react"; // useEffect를 통해 컴포넌트 렌더링 후 사이드 이펙트를 처리합니다.
import { useParams } from "react-router-dom"; // useParams를 사용해 URL의 매개변수를 가져옵니다.

const DetailPage = () => {
  const params = useParams(); // URL에서 전달된 파라미터를 추출합니다.
  const pokemonId = params.id; // 추출한 파라미터에서 포켓몬 ID를 가져옵니다.
  const baseUrl = "https://pokeapi.co/api/v2/pokemon/"; // API 기본 URL

  // 컴포넌트가 마운트되었을 때 포켓몬 데이터를 가져오는 함수를 호출합니다.
  useEffect(() => {
    fetchPokeDetailData(); // 데이터 가져오기 함수 호출
  }, []); // 빈 배열을 두어 컴포넌트가 마운트될 때 한 번만 실행되게 합니다.

  // 포켓몬 상세 데이터를 가져오는 비동기 함수입니다.
  const fetchPokeDetailData = async () => {
    const url = `${baseUrl}${pokemonId}`; // 포켓몬 ID를 기반으로 API 엔드포인트 생성
    try {
      const { data: pokemonData } = await axios.get(url); // 포켓몬 데이터를 API로부터 가져옵니다.

      if (pokemonData) {
        // 가져온 데이터에서 필요한 정보만 구조 분해 할당으로 추출합니다.
        const { name, id, types, weight, height, stats, abilties } =
          pokemonData;

        // 포켓몬의 다음과 이전 데이터를 가져오는 함수 호출
        const nextAndPrevPokemon = await getNextAndPrevPokemon(id);
        console.log("nextAndPrevPokemon", nextAndPrevPokemon); // 가져온 데이터를 콘솔에 출력합니다.
      }
    } catch (error) {
      console.log(error); // 에러 발생 시 콘솔에 출력합니다.
    }
  };

  // 포켓몬의 이전/다음 데이터를 가져오는 비동기 함수입니다.
  const getNextAndPrevPokemon = async (id) => {
    const urlPokemon = `${baseUrl}?limit=1&offset=${id - 1}`; // 포켓몬 ID를 기반으로 이전과 다음 포켓몬 데이터를 가져오기 위한 URL 생성

    const { data: pokemonData } = await axios.get(urlPokemon); // API 호출로 포켓몬 데이터를 가져옵니다.
    console.log("pokemonData", pokemonData); // 가져온 데이터를 콘솔에 출력합니다.

    // 다음 포켓몬 데이터가 있으면 호출해 가져옵니다.
    const nextResponse =
      pokemonData.next && (await axios.get(pokemonData.next));

    // 이전 포켓몬 데이터가 있으면 호출해 가져옵니다.
    const previousResponse =
      pokemonData.previous && (await axios.get(pokemonData.previous));
    // 다음과 이전 포켓몬의 이름을 반환합니다.
    return {
      next: nextResponse?.data?.results?.[0]?.name,
      previous: previousResponse?.data?.results?.[0]?.name,
    };
  };

  return <div>DetailPage</div>; // DetailPage 컴포넌트를 렌더링합니다.
};

export default DetailPage;
