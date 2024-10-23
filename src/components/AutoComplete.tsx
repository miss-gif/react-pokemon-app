import { all } from "axios";
import React, { useState } from "react";
import { PokemonNameAndUrl } from "../types/PokemonData";

interface AutoCompleteProps {
  allPokemons: PokemonNameAndUrl[];
  setDisplayedPokemons: React.Dispatch<
    React.SetStateAction<PokemonNameAndUrl[]>
  >;
}

const AutoComplete = ({
  allPokemons,
  setDisplayedPokemons,
}: AutoCompleteProps) => {
  const [searchTerm, setSearchTerm] = useState(""); // 검색어를 저장할 상태 변수를 정의합니다.

  const filterNames = (input: string) => {
    const value = input.toLowerCase();
    return value ? allPokemons.filter((e) => e.name.includes(value)) : [];
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 폼의 기본 동작을 막습니다.

    let text = searchTerm.trim();

    setDisplayedPokemons(filterNames(text)); // 검색어를 포함하는 포켓몬을 찾아서 화면에 출력합니다.
    setSearchTerm(""); // 검색어를 초기화합니다.
  };

  const checkEqualName = (input: string) => {
    const filteredArray = filterNames(input);

    return filteredArray[0]?.name === input ? [] : filteredArray;
  };

  return (
    <>
      <div className="relative z-50">
        <form
          onSubmit={handleSubmit} // 폼을 제출할 때 handleSubmit 함수를 호출합니다.
          className="relative flex justify-center items-center w-[20.5rem] h-6 rounded-lg m-auto"
        >
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
        {checkEqualName(searchTerm).length > 0 && (
          <div className="w-full flex bottom-0 h-0 flex-col absolute justify-center items-center translate-y-2">
            <div className="w-0 h-0 bottom-0 border-x-transparent border-x-8 border-b-[8px] border-gray-700 -translate-y-1/2"></div>
            <ul className="w-40 max-h-[134px] py-1 bg-gray-700 rounded-lg absolute top-0 overflow-auto scrollbar-none">
              {checkEqualName(searchTerm).map((e, i) => {
                return (
                  <li key={`button-${i}`}>
                    <button
                      onClick={() => {
                        setSearchTerm(e.name);
                      }}
                      className="text-base w-full hover:bg-gray-600 p-[2px] text-gray-100"
                    >
                      {e.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default AutoComplete;
