# 포켓몬 도감

## 프로젝트 생성

`npm init vite ./`
`npm i`

## 라이브러리 추가 설치

`axios`
`react-router-dom`
`autoprefixer`
`postcss`
`tailwind-scrollbar`
`tailwindcss`

---

###### `mousedown`과 `touchstart` 차이

1. touchstart
   모바일 전용: 터치스크린 장치(모바일, 태블릿)에서 손가락이 화면에 닿는 순간 발생합니다.
   즉각적인 반응: 손가락이 화면에 닿자마자 바로 발생하기 때문에, 가장 빠른 시점에 터치 이벤트를 감지할 수 있습니다.
   고유한 터치 이벤트: 데스크톱 환경에서는 발생하지 않으며, 모바일 터치 상호작용과 관련된 추가적인 정보(멀티터치, 터치 좌표 등)를 제공합니다.
2. mousedown
   주로 데스크톱 환경: 마우스를 클릭하는 순간 발생하는 이벤트입니다. 하지만 일부 모바일 브라우저에서도 발생할 수 있습니다.
   터치 이벤트와 중복: 모바일 터치스크린에서 터치하면, touchstart가 발생한 뒤에 브라우저에 따라 mousedown 이벤트가 추가로 발생할 수 있습니다. 이는 터치가 마우스 클릭으로 변환되어 발생하는 현상입니다.
   지연 발생: mousedown은 touchstart보다 약간 지연될 수 있습니다. 브라우저는 터치 이벤트가 마우스 이벤트로 변환되는 과정을 거치기 때문에, 수백 밀리초 정도의 지연이 발생할 수 있습니다.
3. 차이점
   발생 시점: touchstart는 터치가 시작되자마자 발생하지만, mousedown은 터치 이벤트를 처리한 후에 발생할 수 있습니다.
   대상: touchstart는 터치스크린에서만 발생하며, mousedown은 마우스 클릭을 기반으로 하므로 데스크톱 환경에서 주로 발생합니다. 그러나 일부 모바일 브라우저에서도 터치를 마우스 클릭으로 변환해 mousedown을 발생시키기도 합니다.
   사용 사례: 모바일 장치에서 터치 상호작용을 처리하려면 touchstart가 더 적합하며, 데스크톱에서는 mousedown이 주로 사용됩니다.

- 결론:
  모바일에서 touchstart와 mousedown은 비슷하지만 동일하지 않습니다. 특히, 모바일 기기에서 터치스크린 상호작용을 보다 정확하게 처리하려면 touchstart를 사용하는 것이 더 적합합니다. 단, 중복 발생을 고려해 모바일에서는 touchstart를 사용하고, 데스크톱에서는 mousedown을 사용하는 방식으로 구분하는 것이 좋습니다.

###### 파이어베이스 배포 중 에러 발생 및 해결 방법

`Error: Failed to list Firebase projects. See firebase-debug.log for more info.` 에러 발생시

터미널에 `firebase login --reauth` 입력 후 해결
