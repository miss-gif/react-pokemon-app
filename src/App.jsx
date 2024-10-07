import axios from "axios"; // axios 라이브러리를 import 합니다.
import { useEffect, useState } from "react"; // React의 useState와 useEffect 훅을 import 합니다.
import AutoComplete from "./components/AutoComplete";
import PokeCard from "./components/PokeCard"; // PokeCard 컴포넌트를 import 합니다.

const App = () => {
  // 모든 포켓몬 데이터를 가지고 있는 State
  const [allPokemons, setAllPokemons] = useState([]);

  // 실제로 리스트로 보여주는 포켓몬 데이터를 가지고 있는 State
  const [displayedPokemons, setDisplayedPokemons] = useState([]);

  // 한번에 보여주는 포켓몬 수
  const limitNum = 20;
  // PokeAPI에서 데이터를 가져오기 위한 URL을 만듭니다.
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;

  // 컴포넌트가 처음 렌더링될 때 포켓몬 데이터를 가져옵니다.
  useEffect(() => {
    fetchPokeData();
  }, []);

  const filterDisplayedPokemonData = (
    allPokemonsData,
    displayedPokemons = []
  ) => {
    const limit = displayedPokemons.length + limitNum;
    // 모든 포켓몬 데이터에서 limitNum 만큼 더 가져오기
    const array = allPokemonsData.filter(
      (pokemon, index) => index + 1 <= limit
    );
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

  return (
    <>
      <article className="pt-6">
        <header className="flex flex-col gap-2 w-full px-4 z-50">
          <AutoComplete
            allPokemons={allPokemons}
            setDisplayedPokemons={setDisplayedPokemons}
          />
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
