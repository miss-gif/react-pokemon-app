import axios from "axios";
import { useEffect, useState } from "react";

const pokeCard = ({ url, name }) => {
  const [pokemon, setPokemon] = useState();

  useEffect(() => {
    // 포켓몬 데이터를 가져오는 함수 호출
    fetchPokeDetailData();
  }, []);

  // 포켓몬 데이터를 가져오는 비동기 함수 정의
  const fetchPokeDetailData = async () => {
    try {
      // Axios를 사용하여 포켓몬 API에 GET 요청을 보냅니다.
      const response = await axios.get(url);
      // 가져온 데이터를 콘솔에 출력합니다.
      console.log(response.data);
      // 가져온 데이터를 포맷화하여 상태 업데이트합니다.
      const PokeData = formatPokemonData(response.data);
      setPokemon(PokeData);
    } catch (error) {
      // 오류가 발생하면 콘솔에 오류 메시지를 출력합니다.
      console.log(error);
    }
  };

  // 포켓몬 데이터를 포맷화하는 함수 정의
  const formatPokemonData = (params) => {
    const { id, types, name } = params;
    const PokeData = {
      id,
      name,
      types: types[0].type.name,
    };
    return PokeData;
  };

  return <div>pokeCard</div>;
};

export default pokeCard;
