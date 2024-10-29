import axios from "axios";
import { useEffect, useState, useRef, useCallback } from "react";
import AutoComplete from "../../components/AutoComplete";
import PokeCard from "../../components/PokeCard";
import { PokemonData, PokemonNameAndUrl } from "../../types/PokemonData";

const MainPage = () => {
  // 모든 포켓몬 데이터를 가지고 있는 State
  const [allPokemons, setAllPokemons] = useState<PokemonNameAndUrl[]>([]);

  // 실제로 리스트로 보여주는 포켓몬 데이터를 가지고 있는 State
  const [displayedPokemons, setDisplayedPokemons] = useState<
    PokemonNameAndUrl[]
  >([]);

  // 한번에 보여주는 포켓몬 수
  const limitNum = 20;
  // PokeAPI에서 데이터를 가져오기 위한 URL을 만듭니다.
  const url = `https://pokeapi.co/api/v2/pokemon/?limit=1008&offset=0`;
  const loader = useRef<HTMLDivElement | null>(null);

  // 초기 데이터 가져오기
  useEffect(() => {
    fetchPokeData();
  }, []);

  const fetchPokeData = async () => {
    try {
      const response = await axios.get<PokemonData>(url);
      setAllPokemons(response.data.results);
      setDisplayedPokemons(filterDisplayedPokemonData(response.data.results));
    } catch (error) {
      console.log(error);
    }
  };

  const filterDisplayedPokemonData = (
    allPokemonsData: PokemonNameAndUrl[],
    displayedPokemons: PokemonNameAndUrl[] = []
  ) => {
    const limit = displayedPokemons.length + limitNum;
    return allPokemonsData.filter((_, index) => index + 1 <= limit);
  };

  const loadMorePokemons = useCallback(() => {
    setDisplayedPokemons((prev) =>
      filterDisplayedPokemonData(allPokemons, prev)
    );
  }, [allPokemons]);

  // IntersectionObserver를 이용해 스크롤 감지
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMorePokemons();
        }
      },
      { threshold: 1 }
    );

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [loader, loadMorePokemons]);

  return (
    <article className="pt-[70px]">
      <header className="flex flex-col gap-2 w-full px-4 z-50">
        <AutoComplete
          allPokemons={allPokemons}
          setDisplayedPokemons={setDisplayedPokemons}
        />
      </header>
      <section className="pt-6 flex flex-col justify-center items-center overflow-auto z-0">
        <div className="flex flex-row flex-wrap gap-[16px] items-center justify-center px-2 max-w-4xl">
          {displayedPokemons.length > 0 ? (
            displayedPokemons.map(({ url, name }: PokemonNameAndUrl) => (
              <PokeCard key={url} url={url} name={name} />
            ))
          ) : (
            <h2 className="font-medium text-lg text-slate-900 mb-1">
              포켓몬이 없습니다.
            </h2>
          )}
        </div>
        <div ref={loader} className="h-1"></div>
        {/* IntersectionObserver를 감지할 요소 */}
      </section>
    </article>
  );
};

export default MainPage;
