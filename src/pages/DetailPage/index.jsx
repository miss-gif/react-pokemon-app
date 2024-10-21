import axios from "axios"; // axios를 사용해 API 호출을 처리합니다.
import React, { useEffect, useState } from "react"; // useEffect를 통해 컴포넌트 렌더링 후 사이드 이펙트를 처리합니다.
import { Link, useParams } from "react-router-dom"; // useParams를 사용해 URL의 매개변수를 가져옵니다.
import { Loading } from "../../assets/Loading";
import { LessThan } from "../../assets/LessThan";
import { GreaterThan } from "./../../assets/GreaterThan";
import { ArrowLeft } from "../../assets/ArrowLeft";
import { Balance } from "./../../assets/Balance";
import { Vector } from "./../../assets/Vector";
import Type from "../../components/Type";
import BaseStat from "./../../components/BaseStat";
import DamageRelations from "../../components/DamageRelations";
import DamageModal from "../../components/DamageModal";

const DetailPage = () => {
  const [pokemon, setPokemon] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        const { name, id, types, weight, height, stats, abilities, sprites } =
          pokemonData;

        // 포켓몬의 다음과 이전 데이터를 가져오는 함수 호출
        const nextAndPrevPokemon = await getNextAndPrevPokemon(id);

        // 각 타입의 데미지 관계 데이터를 병렬로 가져옵니다.
        const DamageRelations = await Promise.all(
          types.map(async (i) => {
            const type = await axios.get(i.type.url); // 각 타입의 데미지 관계를 가져옵니다.
            return type.data.damage_relations; // 데미지 관계 데이터를 반환합니다.
          })
        );

        // 가져온 포켓몬 데이터를 포맷팅하여 필요한 정보를 구조화합니다.
        const formattedPokemonData = {
          name,
          id,
          weight: weight / 10, // kg 단위로 변환
          height: height / 10, // m 단위로 변환
          stats: formatPokemonStats(stats), // 포켓몬의 스탯을 포맷팅
          abilities: formatPokemonAbilities(abilities), // 포켓몬의 능력을 포맷팅
          next: nextAndPrevPokemon.next, // 다음 포켓몬 데이터
          previous: nextAndPrevPokemon.previous, // 이전 포켓몬 데이터
          DamageRelations, // 타입별 데미지 관계 데이터 배열
          types: types.map((type) => type.type.name), // 타입 데이터 배열
          sprites: formatPokemonSprites(sprites), // 포켓몬 이미지 데이터
        };

        setPokemon(formattedPokemonData); // 포켓몬 데이터를 상태에 저장합니다.
        isLoading && setIsLoading(false); // 로딩 상태를 false로 변경합니다.

        // 포켓몬 데이터를 콘솔에 출력합니다.
        console.log("formattedPokemonData", formattedPokemonData);
      }
    } catch (error) {
      console.log(error); // 에러 발생 시 콘솔에 출력합니다.
      setIsLoading(false); // 로딩 상태를 false로 변경합니다.
    }
  };

  const formatPokemonSprites = (sprites) => {
    const newSprites = {
      ...sprites,
    };
    Object.keys(newSprites).forEach((key) => {
      if (typeof newSprites[key] !== "string") {
        delete newSprites[key];
      }
    });
    return Object.values(newSprites);
  };

  const formatPokemonAbilities = (abilities) => {
    return abilities
      .filter((_, index) => index <= 1)
      .map((obj) => obj.ability.name.replaceAll("-", " "));
  };

  const formatPokemonStats = ([
    statHP,
    statATK,
    statDEP,
    statSATK,
    statSDEP,
    statSPD,
  ]) => [
    { name: "Hip Points", baseStat: statHP.base_stat },
    { name: "Attack", baseStat: statATK.base_stat },
    { name: "Defense", baseStat: statDEP.base_stat },
    { name: "Special Attack", baseStat: statSATK.base_stat },
    { name: "Special Defense", baseStat: statSDEP.base_stat },
    { name: "Speed", baseStat: statSPD.base_stat },
  ];

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

  if (isLoading)
    return (
      <div className="absolute h-auto w-auto top-1/3 -translate-x-1/2 left-1/2 z-50">
        <Loading className="w-12 h-12 z-50 animate-spin text-slate-900" />
      </div>
    ); // 데이터를 불러오는 중이면 로딩 중을 표시합니다.

  if (!isLoading && !pokemon) return <div>No Data</div>; // 데이터가 없으면 No Data를 표시합니다.

  const img = `http://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon?.id}.png`;
  const bg = `bg-${pokemon?.types[0]}`;
  const text = `text-${pokemon?.types[0]}`;

  return (
    <article className="flex items-center gap-1 flex-col w-full">
      <div
        className={`${bg} w-auto h-full flex flex-col z-0 items-center justify-end relative overflow-hidden`}
      >
        {pokemon.previous && (
          <Link
            to={`/pokemon/${pokemon.previous}`}
            className="absolute top-[40%] -translate-y-1/2 z-50 left-1"
          >
            <LessThan className="w-5 h-8 p-1" />
          </Link>
        )}

        {pokemon.next && (
          <Link
            to={`/pokemon/${pokemon.next}`}
            className="absolute top-[40%] -translate-y-1/2 z-50 right-1"
          >
            <GreaterThan className="w-5 h-8 p-1" />
          </Link>
        )}

        <section className="w-full flex flex-col z-20 items-center justify-end relative h-full">
          <div className="absolute z-30 top-6 flex items-center w-full justify-between px-2">
            <div className="flex items-center gap-1">
              <Link to="/">
                <ArrowLeft className="w-6 h-8 text-zinc-200" />
              </Link>
              <h2 className="text-zinc-200 font-bold  text-xl capitalize ">
                {pokemon.name}
              </h2>
            </div>
            <div className="text-zinc-200 font-bold text-md">
              #{pokemon.id.toString().padStart(3, "00")}
            </div>
          </div>

          <div className="relative h-auto max-w-[15.5rem] z-20 mt-6 -mb-16">
            <img
              src={img}
              width="100%"
              height="auto"
              loading="lazy"
              alt={pokemon.name}
              className={`object-contain h-full`}
              onClick={() => setIsModalOpen(true)}
            />
          </div>
        </section>

        <section className="w-full min-h-[65%] h-full bg-gray-800 z-10 pt-14 flex flex-col items-center gap-3  px-5 pb-4">
          <div className="flex items-center justify-center gap-4">
            {/* {포켓몬 타입} */}
            {pokemon.types.map((type) => (
              <Type key={type} type={type} />
            ))}
          </div>
          <h2 className={`text-base font-semibold ${text}`}>정보</h2>
          <div className="flex  w-full items-center justify-between max-w-[400px] text-center">
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Balance />
                {pokemon.weight}kg
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">Weight</h4>
              <div className="text-sm flex mt-1 gap-2 justify-center text-zinc-200">
                <Vector />
                {pokemon.height}m
              </div>
            </div>
            <div className="w-full">
              <h4 className="text-[0.5rem] text-zinc-100">ability</h4>
              {pokemon.abilities.map((ability) => (
                <div
                  key={ability}
                  className="text-zinc-100 capitalize text-[0.5rem]"
                >
                  {ability}
                </div>
              ))}
            </div>
          </div>
          <h2 className={`text-base font-semibold ${text}`}>기본 능력치</h2>
          <div className="w-full text-zinc-100">
            <table>
              <tbody>
                {pokemon.stats.map((stat) => (
                  <BaseStat
                    key={stat.name}
                    valueStat={stat.baseStat}
                    nameStat={stat.name}
                    type={pokemon.types[0]}
                  />
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex my-8 flex-wrap justify-center">
            {pokemon.sprites.map((url, index) => {
              return (
                <img
                  key={index}
                  src={url}
                  alt={pokemon.name}
                  className="w-16 h-16"
                />
              );
            })}
          </div>
        </section>
      </div>
      {isModalOpen && (
        <DamageModal
          setIsModalOpen={setIsModalOpen}
          damages={pokemon.DamageRelations}
        />
      )}
    </article>
  ); // DetailPage 컴포넌트를 렌더링합니다.
};

export default DetailPage;
