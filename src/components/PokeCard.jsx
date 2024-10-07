import axios from "axios";
import { useEffect, useState } from "react";
import LazyImage from "./LazyImage";

const PokeCard = ({ url, name }) => {
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
      // console.log(response.data);
      // 가져온 데이터를 포맷화하여 상태 업데이트합니다.
      const pokemonData = formatPokemonData(response.data);
      setPokemon(pokemonData);
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

  // console.log("pokemon", pokemon);

  const bg = `bg-${pokemon?.types}`;
  const border = `border-${pokemon?.types}`;
  const text = `text-${pokemon?.types}`;

  const img = `http://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;

  return (
    <>
      {pokemon && (
        <a
          href="/poketmon/${name}"
          className={`box-border rounded-lg ${border} w-[8.5rem]
          h-[8.5rem] z-0 bg-slate-800 justify-between items-center`}
        >
          <div
            className={`${text} h[1.5rem] text-xs w-full pt-1 px-2 text-right rounded-t-lg`}
          >
            #{pokemon.id.toString().padStart(3, "00")}
          </div>
          <div className={`w-full f-6 flex items-center justify-center`}>
            <div
              className={`box-border relative flex w-full h-[5.5rem] basis justify-center items-center`}
            >
              <LazyImage url={img} alt={name} />
            </div>
          </div>
          <div
            className={`${bg} text-center text-xs text-zinc-100 h-[1.5rem] rounded-b-lg uppercase font-medium  pt-1`}
          >
            {pokemon.name}
          </div>
        </a>
      )}
    </>
  );
};

export default PokeCard;
