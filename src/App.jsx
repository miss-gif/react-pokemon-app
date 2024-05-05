import axios from "axios";
import { useState, useEffect } from "react";
import PokeCard from "./components/PokeCard";

const App = () => {
  const [pokemons, setPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    fetchPokeDate(true);
  }, []);

  const fetchPokeDate = async (isFirstFetch) => {
    try {
      const offsetValue = isFirstFetch ? 0 : offset + limit;
      const url = `https://pokeapi.co/api/v2/pokemon/?limit=${limit}&offset=${offsetValue}`;
      const response = await axios.get(url);
      setPokemons([...pokemons, ...response.data.results]);
      setOffset(offsetValue);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <article className="pt-6">
        <header className="flex flex-col gap-2 w-full px-4 z-50">
          Input form
        </header>
        <section className="pt-6 flex flex-col justify-center items-center overflow-auto z-0">
          <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
            {pokemons.length > 0 ? (
              pokemons.map(({ url, name }, index) => (
                <PokeCard key={url} url={url} name={name} />
              ))
            ) : (
              <h2 className="font-medium text-lg text-slate-900 mb-1">
                포켓몬이 없습니다.
              </h2>
            )}
          </div>
        </section>
        <div className="text-center">
          <button
            className="bg-slate-800 px-6 py-2 my-4 text-base rounded-lg font-bold text-white"
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

export default App;
