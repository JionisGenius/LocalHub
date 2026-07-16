권호빈 - AI가 사용자의 역량에 따라 성능의 차이가 꽤 많이 나는 것 같다고 느꼈음.
송지원 - 미리 파일구조를 나눠야하는것을 깨달았다.
이경빈 - AI의 사용이 생각보다 어려웠습니다. 좋은 경험이였습니다.




1. 오류 내용 : netlify function 연동안됨, AI 챗봇 프롬프트 조회 실패 나옴
  오류 원인: 기존에 가지고있는 Api key가 `gpt-5 mini` 전용 key 인데 정작 html 코드 내에서 프롬프트 호출을 `gpt 3.5 turbo` 모델만 호출이 되게 작성이 되어 있어 모델이 달라 key의 권한 부족으로 실패했었음 
  해결 방법 : 호출을 `gpt-5-mini`  모델로 수정함

2. 오류내용 :  AI 챗봇 사용시 local OpenAI호출 실패
   오류 원인 :  gpt-5-mini 모델은 OpenAI의 최신 추론 모델 계열이므로, 기존 레거시 모델들과 달리 temperature 매개변수 값으로 오직 기본값인 1만 지원하도록 제한되어 있습니다. 이 때문에 API 호출 시 temperature 0.7을 전송하면 OpenAI API 측에서 차단 메시지(400 Bad Request)를 반환하는 구조였습니다.
   해결방법 :  temperature parameter 를 1로 고침
