import React, { useEffect, useState } from "react";
import { DamageRelations as DamageRelationsProps } from "../types/DamageRelationOfPokemonTypes";
import Type from "./Type";
import {
  Damage,
  DamageFromAndTo,
  SeparateDamge,
} from "../types/SeparateDamgeRelations";

interface DamageModalProps {
  damages: DamageRelationsProps[];
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Info {
  name: string;
  url: string;
}

const DamageRelations = ({ damages }: DamageModalProps) => {
  // state로 변환된 데이터를 저장하는 변수
  const [damagePokemonForm, setDamagePokemonForm] = useState<SeparateDamge>();

  useEffect(() => {
    // damages 배열의 각 damage 객체를 처리하여 분리된 데이터를 생성
    const arrayDamage = damages.map((damage) => {
      return separateObjectBetweenToAndFrom(damage);
    });

    if (arrayDamage.length === 2) {
      // arrayDamage 배열의 길이가 2일 때 두 데이터를 결합하여 처리
      const obj = joinDamageRelations(arrayDamage);
      setDamagePokemonForm(reduceDuplicateValues(postDamageValue(obj.from)));
    } else {
      // arrayDamage가 2가 아닌 경우 첫 번째 from 객체만 처리
      setDamagePokemonForm(postDamageValue(arrayDamage[0].from));
    }
  }, [damages]); // 의존성 배열에 damages 추가

  // arrayDamage의 'to'와 'from' 데이터를 결합하는 함수
  const joinDamageRelations = (props: DamageFromAndTo[]): DamageFromAndTo => {
    return {
      to: joinObjects(props, "to"),
      from: joinObjects(props, "from"),
    };
  };

  // 두 객체의 'to' 혹은 'from' 데이터를 병합하는 함수
  const joinObjects = (props: DamageFromAndTo[], string: string) => {
    const key = string as keyof (typeof props)[0]; // 'to' 혹은 'from'을 key로 사용
    const firstArrayValue = props[0][key]; // 첫 번째 객체의 값을 가져옴
    const secondArrayValue = props[1][key]; // 두 번째 객체의 값을 가져옴

    // secondArrayValue의 각 항목을 순회하여 firstArrayValue와 병합
    const result = Object.entries(secondArrayValue).reduce(
      (acc, [keyName, value]: [string, Damage]) => {
        const key = keyName as keyof typeof firstArrayValue; // keyName을 keyof로 변환

        const firstValue = firstArrayValue[key] || []; // 첫 번째 객체에 해당 키가 없으면 빈 배열 사용
        const concatenated = firstValue?.concat(value); // 두 객체의 값을 병합
        return { [keyName]: concatenated, ...acc };
      },
      {}
    );

    return result; // 병합된 결과 반환
  };

  // 중복된 값을 합치는 함수
  const reduceDuplicateValues = (props: SeparateDamge) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };

    // 각 damage 값을 중복 처리 후 반환
    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName as keyof typeof props;

      const verifiedValue = filterForUniqueValues(value, duplicateValues[key]);
      return { [keyName]: verifiedValue, ...acc };
    }, {});
  };

  // 중복된 값을 걸러내는 함수
  const filterForUniqueValues = (
    valueForFiltering: Damage[],
    damageValue: string
  ) => {
    const initialArray: Damage[] = [];

    // 각 damage 객체에서 중복을 제거하여 damage 값을 부여
    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;

      // 이미 존재하는 name인지 확인하여 중복을 걸러냄
      const filterACC = acc.filter((a) => a.name !== name);

      // 중복이 없으면 새 값을 추가, 있으면 기존 값을 갱신
      return filterACC.length === acc.length
        ? [currentValue, ...acc]
        : [{ damageValue, name, url }, ...filterACC];
    }, initialArray);
  };

  // 서버에 전송할 데이터를 가공하는 함수
  const postDamageValue = (props: SeparateDamge): SeparateDamge => {
    // damage 종류에 따라 값을 매핑
    const result = Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName as keyof typeof props;

      const valuesOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };

      // 매핑된 값과 기존 값을 합쳐 새로운 객체 생성
      return {
        [keyName]: value.map((i: Info[]) => ({
          damageValue: valuesOfKeyName[key], // damage type에 맞는 값 추가
          ...i,
        })),
        ...acc,
      };
    }, {});

    // 최종 변환된 데이터를 반환
    return result;
  };

  // damage 객체에서 "_from"과 "_to" 데이터를 분리하는 함수
  const separateObjectBetweenToAndFrom = (
    damage: DamageRelationsProps
  ): DamageFromAndTo => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);

    // 분리된 from과 to 반환
    return { from, to };
  };

  // "_from" 또는 "_to"로 필터링된 데이터를 반환하는 함수
  const filterDamageRelations = (
    valueFilter: string,
    damage: DamageRelationsProps
  ) => {
    const result: SeparateDamge = Object.entries(damage)
      .filter(([keyName, _]) => keyName.includes(valueFilter)) // 특정 패턴으로 필터링
      .reduce((acc, [keyName, value]): SeparateDamge => {
        // valueFilter를 키에서 제거하여 새로운 객체 생성
        const keyWithoutValueFilter = keyName.replace(valueFilter, "");
        return { [keyWithoutValueFilter]: value, ...acc };
      }, {});

    // 필터링된 결과 반환
    return result;
  };

  return (
    <div className="flex gap-2 flex-col">
      {damagePokemonForm ? (
        <>
          {Object.entries(damagePokemonForm).map(([keyName, value]) => {
            const key = keyName as keyof typeof damagePokemonForm;
            const valueOfKeyName = {
              double_damage: "약점",
              half_damage: "저항",
              no_damage: "무효",
            };

            return (
              <div key={key}>
                <h3 className="capitalize font-medium text-sm md:text-base text-slate-500 text-center">
                  {valueOfKeyName[key]}
                </h3>
                <div className="flex flex-wrap gap-1 justify-center">
                  {value.length > 0 ? (
                    value.map(({ name, url, damageValue }: Damage) => {
                      return (
                        <Type type={name} key={url} damageValue={damageValue} />
                      );
                    })
                  ) : (
                    <Type type={"none"} key={"none"} />
                  )}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default DamageRelations;
