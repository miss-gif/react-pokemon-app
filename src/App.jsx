import axios from "axios"; // axios 라이브러리를 import 합니다.
import { useState, useEffect } from "react"; // React의 useState와 useEffect 훅을 import 합니다.
import PokeCard from "./components/PokeCard"; // PokeCard 컴포넌트를 import 합니다.
import useDebounce from "./hooks/useDebounce";

const App = () => {
  // 모든 포켓몬 데이터를 가지고 있는 State
  const [allPokemons, setAllPokemons] = useState([]);

  // 실제로 리스트로 보여주는 포켓몬 데이터를 가지고 있는 State
  const [displayedPokemons, setDisplayedPokemons] = useState([]);

  // 한번에 보여주는 포켓몬 수
  const limitNum = 20;
  // PokeAPI에서 데이터를 가져오기 위한 URL을 만듭니다.
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;

  const [searchTerm, setSearchTerm] = useState(""); // 검색어를 저장할 상태 변수를 정의합니다.

  // 커스텀 훅 사용으로 지연 검색
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // 컴포넌트가 처음 렌더링될 때 포켓몬 데이터를 가져옵니다.
  useEffect(() => {
    fetchPokeData();
  }, []);

  useEffect(() => {
    handleSearchInput(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  const filterDisplayedPokemonData = (
    allPokemonsData,
    displayedPokemons = []
  ) => {
    const limit = displayedPokemons.length + limitNum;
    // 모든 포켓몬 데이터에서 limitNum 만큼 더 가져오기
    const array = allPokemonsData.filter((pokemon, index) => index < limit);
    return array;
  };

  // 포켓몬 데이터를 가져오는 비동기 함수입니다.
  const fetchPokeData = async () => {
    try {
      // 1008 포켓몬 데이터 받아오기
      const response = await axios.get(url);

      // 모든 포켓몬 데이터 기억하기
      setAllPokemons(response.data.results);
      // 실제로 화면에 출력되는 포켓몬 리스트
      setDisplayedPokemons(filterDisplayedPokemonData(response.data.results));
    } catch (error) {
      console.log(error); // 에러가 발생하면 콘솔에 출력합니다.
    }
  };

  // 검색어를 처리하는 함수입니다.
  const handleSearchInput = async (searchTerm) => {
    if (searchTerm.length > 0) {
      // 검색어가 비어 있지 않으면
      try {
        // 검색어로 포켓몬 데이터를 가져옵니다.
        const response = await axios.get(
          `http://pokeapi.co/api/v2/pokemon/${searchTerm}`
        );
        // 포켓몬 데이터를 설정합니다.
        const pokemonData = {
          url: `http://pokeapi.co/api/v2/pokemon/${response.data.id}`,
          name: searchTerm,
        };
        setDisplayedPokemons([pokemonData]); // 검색 결과를 displayedPokemons 상태에 설정합니다.
      } catch (error) {
        setDisplayedPokemons([]); // 검색 결과가 없을 경우, displayedPokemons 상태를 빈 배열로 설정합니다.
        console.error(error); // 에러가 발생하면 콘솔에 출력합니다.
      }
    } else {
      fetchPokeData(); // 검색어가 비어 있으면 전체 포켓몬 데이터를 다시 가져옵니다.
    }
  };

  return (
    <>
      <article className="pt-6">
        <header className="flex flex-col gap-2 w-full px-4 z-50">
          <div className="relative z-50">
            <form className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }} // 검색어가 변경될 때 검색어 상태를 업데이트합니다.
                placeholder="포켓몬을 검색하세요"
                className="text-xs w-[20.5rem] h-6 px-2 py-1 bg-[hsl(214,13%,47%)] rounded-lg text-gray-300 text-center"
              />
              <button
                type="submit"
                className="text-xs bg-slate-900 text-slate-300 w-[2.5rem] h-6 px-2 py-1 rounded-r-lg text-center absolute right-0 hover:bg-slate-700"
              >
                검색
              </button>
            </form>
          </div>
        </header>
        <section className="pt-6 flex flex-col justify-center items-center overflow-auto z-0">
          <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
            {displayedPokemons.length > 0 ? (
              // 포켓몬 데이터가 있을 경우, PokeCard 컴포넌트를 이용해 포켓몬을 표시합니다.
              displayedPokemons.map(({ url, name }, index) => (
                <PokeCard key={url} url={url} name={name} />
              ))
            ) : (
              // 포켓몬 데이터가 없을 경우, 메시지를 표시합니다.
              <h2 className="font-medium text-lg text-slate-900 mb-1">
                포켓몬이 없습니다.
              </h2>
            )}
          </div>
        </section>
        <div className="text-center">
          {allPokemons.length > displayedPokemons.length &&
            allPokemons.length !== 1 && (
              <button
                className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
                // 더 많은 포켓몬 데이터를 가져오기 위해 버튼을 클릭하면 fetchPokeData 함수를 호출합니다.
                onClick={() => {
                  setDisplayedPokemons(
                    filterDisplayedPokemonData(allPokemons, displayedPokemons)
                  );
                }}
              >
                더 보기
              </button>
            )}
        </div>
      </article>
    </>
  );
};

export default App; // App 컴포넌트를 export 합니다.
