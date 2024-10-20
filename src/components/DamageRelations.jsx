import React, { useEffect } from "react";

const DamageRelations = ({ damages }) => {
  console.log("damages", damages);

  useEffect(() => {
    // damages 배열의 각 damage 객체를 처리하여 분리된 데이터를 생성
    const arrayDamage = damages.map((damage) => {
      return separateObjectBetweenToAndFrom(damage);
    });

    if (arrayDamage.length === 2) {
      // 배열의 길이가 2일 때 합치는 부분을 구현할 수 있음
      // (구현되지 않았음)
    } else {
      // arrayDamage가 2가 아닌 경우 첫 번째 from 객체를 postDamageValue로 전달
      postDamageValue(arrayDamage[0].from);
    }
  }, [damages]); // 의존성 배열에 damages 추가

  // 서버에 데이터를 전송하거나 후처리를 하기 위한 함수
  const postDamageValue = (props) => {
    const result = Object.entries(props).reduce((acc, [keyName, value]) => {
      const key = keyName;

      // damage type에 따라 값 매핑
      const valuesOfKeyName = {
        double_damage: "2x",
        half_damage: "1/2x",
        no_damage: "0x",
      };

      // 매핑된 값을 새로운 객체로 변환하여 반환
      return {
        [keyName]: value.map((i) => ({
          damageValue: valuesOfKeyName[key],
          ...i,
        })),
        ...acc,
      };
    }, {});

    // postDamageValue 함수에서 변환된 결과가 사용되지 않으므로 반환
    return result;
  };

  // damage 객체를 "_from"과 "_to" 키에 따라 분리하는 함수
  const separateObjectBetweenToAndFrom = (damage) => {
    const from = filterDamageRelations("_from", damage);
    console.log("from", from);

    const to = filterDamageRelations("_to", damage);
    console.log("to", to);

    return { from, to };
  };

  // damage 객체에서 특정 키 패턴에 맞는 항목을 필터링하는 함수
  const filterDamageRelations = (valueFilter, damage) => {
    const result = Object.entries(damage)
      .filter(([keyName]) => {
        // valueFilter로 시작하는 키만 필터링
        return keyName.includes(valueFilter);
      })
      .reduce((acc, [keyName, value]) => {
        // valueFilter를 제거한 새로운 키로 변환
        const keyWithoutValueFilter = keyName.replace(valueFilter, "");
        return { [keyWithoutValueFilter]: value, ...acc };
      }, {});

    // 필터링된 결과 반환
    return result;
  };

  return <div>DamageRelations</div>;
};

export default DamageRelations;
