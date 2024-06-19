import axios from "axios"; // axios 라이브러리를 import 합니다.
import { useState, useEffect } from "react"; // React의 useState와 useEffect 훅을 import 합니다.
import PokeCard from "./components/PokeCard"; // PokeCard 컴포넌트를 import 합니다.

const App = () => {
  // 포켓몬 데이터를 저장할 상태 변수와 오프셋, 제한 값을 저장할 상태 변수를 정의합니다.
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어를 저장할 상태 변수를 정의합니다.

  // 컴포넌트가 처음 렌더링될 때 포켓몬 데이터를 가져옵니다.
  useEffect(() => {
    fetchPokeDate(true);
  }, []);

  // 포켓몬 데이터를 가져오는 비동기 함수입니다.
  const fetchPokeDate = async (isFirstFetch) => {
    try {
      // 첫 번째 가져오기인지 확인하고, 첫 번째면 offset을 0으로 설정합니다.
      const offsetValue = isFirstFetch ? 0 : offset + limit;
      // PokeAPI에서 데이터를 가져오기 위한 URL을 만듭니다.
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetValue}`;
      const response = await axios.get(url);
      // 새로운 포켓몬 데이터를 기존 데이터에 추가하고, offset을 업데이트합니다.
      setPokemons([...pokemons, ...response.data.results]);
      setOffset(offsetValue);
    } catch (error) {
      console.log(error); // 에러가 발생하면 콘솔에 출력합니다.
    }
  };

  // 검색어를 처리하는 함수입니다.
  const handleSearchInput = async (e) => {
    setSearchTerm(e.target.value); // 검색어 상태를 업데이트합니다.
    if (e.target.value.length > 0) {
      // 검색어가 비어 있지 않으면
      try {
        // 검색어로 포켓몬 데이터를 가져옵니다.
        const response = await axios.get(
          `http://pokeapi.co/api/v2/pokemon/${e.target.value}`
        );
        // 포켓몬 데이터를 설정합니다.
        const pokemonData = {
          url: `http://pokeapi.co/api/v2/pokemon/${response.data.id}`,
          name: searchTerm,
        };
        setPokemons([pokemonData]); // 검색 결과를 pokemons 상태에 설정합니다.
      } catch (error) {
        setPokemons([]); // 검색 결과가 없을 경우, pokemons 상태를 빈 배열로 설정합니다.
        console.error(error); // 에러가 발생하면 콘솔에 출력합니다.
      }
    } else {
      fetchPokeDate(true); // 검색어가 비어 있으면 전체 포켓몬 데이터를 다시 가져옵니다.
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
                onChange={handleSearchInput} // 검색어가 변경될 때 handleSearchInput 함수를 호출합니다.
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
            {pokemons.length > 0 ? (
              // 포켓몬 데이터가 있을 경우, PokeCard 컴포넌트를 이용해 포켓몬을 표시합니다.
              pokemons.map(({ url, name }, index) => (
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
          <button
            className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
            // 더 많은 포켓몬 데이터를 가져오기 위해 버튼을 클릭하면 fetchPokeDate 함수를 호출합니다.
            onClick={() => {
              fetchPokeDate(false);
            }}
          >
            더 보기
          </button>
        </div>
      </article>
    </>
  );
};

export default App; // App 컴포넌트를 export 합니다.
