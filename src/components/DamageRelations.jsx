import React, { useEffect, useState } from "react";

const DamageRelations = ({ damages }) => {
  // state로 변환된 데이터를 저장하는 변수
  const [damagePokemonForm, setDamagePokemonForm] = useState();

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
  const joinDamageRelations = (props) => {
    return {
      to: joinObjects(props, "to"),
      from: joinObjects(props, "from"),
    };
  };

  // 두 객체의 'to' 혹은 'from' 데이터를 병합하는 함수
  const joinObjects = (props, key) => {
    const firstArrayValue = props[0][key]; // 첫 번째 객체의 값을 가져옴
    const secondArrayValue = props[1][key]; // 두 번째 객체의 값을 가져옴

    // secondArrayValue의 각 항목을 순회하여 firstArrayValue와 병합
    const result = Object.entries(secondArrayValue).reduce(
      (acc, [keyName, value]) => {
        const firstValue = firstArrayValue[keyName] || []; // 첫 번째 객체에 해당 키가 없으면 빈 배열 사용
        const concatenated = firstValue.concat(value); // 두 객체의 값을 병합
        return { [keyName]: concatenated, ...acc };
      },
      {}
    );

    return result; // 병합된 결과 반환
  };

  // 중복된 값을 합치는 함수
  const reduceDuplicateValues = (props) => {
    const duplicateValues = {
      double_damage: "4x",
      half_damage: "1/4x",
      no_damage: "0x",
    };

    // 각 damage 값을 중복 처리 후 반환
    return Object.entries(props).reduce((acc, [keyName, value]) => {
      const verifiedValue = filterForUniqueValues(
        value,
        duplicateValues[keyName]
      );
      return { [keyName]: verifiedValue, ...acc };
    }, {});
  };

  // 중복된 값을 걸러내는 함수
  const filterForUniqueValues = (valueForFiltering, damageValue) => {
    const array = [];

    // 각 damage 객체에서 중복을 제거하여 damage 값을 부여
    return valueForFiltering.reduce((acc, currentValue) => {
      const { url, name } = currentValue;

      // 이미 존재하는 name인지 확인하여 중복을 걸러냄
      const filterACC = acc.filter((a) => a.name !== name);

      // 중복이 없으면 새 값을 추가, 있으면 기존 값을 갱신
      return filterACC.length === acc.length
        ? [currentValue, ...acc]
        : [{ DamageValut: damageValue, name, url }, ...filterACC];
    }, []);
  };

  // 서버에 전송할 데이터를 가공하는 함수
  const postDamageValue = (props) => {
    // damage 종류에 따라 값을 매핑
    const result = Object.entries(props).reduce((acc, [keyName, value]) => {
      const valuesOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };

      // 매핑된 값과 기존 값을 합쳐 새로운 객체 생성
      return {
        [keyName]: value.map((i) => ({
          damageValue: valuesOfKeyName[keyName], // damage type에 맞는 값 추가
          ...i,
        })),
        ...acc,
      };
    }, {});

    // 최종 변환된 데이터를 반환
    return result;
  };

  // damage 객체에서 "_from"과 "_to" 데이터를 분리하는 함수
  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations("_from", damage);
    const to = filterDamageRelations("_to", damage);

    // 분리된 from과 to 반환
    return { from, to };
  };

  // "_from" 또는 "_to"로 필터링된 데이터를 반환하는 함수
  const filterDamageRelations = (valueFilter, damage) => {
    const result = Object.entries(damage)
      .filter(([keyName]) => keyName.includes(valueFilter)) // 특정 패턴으로 필터링
      .reduce((acc, [keyName, value]) => {
        // valueFilter를 키에서 제거하여 새로운 객체 생성
        const keyWithoutValueFilter = keyName.replace(valueFilter, "");
        return { [keyWithoutValueFilter]: value, ...acc };
      }, {});

    // 필터링된 결과 반환
    return result;
  };

  return <div>DamageRelations</div>; // UI 반환
};

export default DamageRelations;
