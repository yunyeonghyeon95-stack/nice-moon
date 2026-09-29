NICE MOON 예약 페이지 설치 방법

1. 이 폴더의 reservation.html, reservation.css, reservation.js를
   GitHub 저장소 최상단(index.html과 같은 위치)에 업로드합니다.

2. 기존 assets 폴더, favicon.svg, index.html은 그대로 유지합니다.

3. 메인 index.html에서 예약 버튼의 href를 아래와 같이 변경합니다.

   기존 예시:
   href="mailto:booking@nicemoon.space?subject=NICE%20MOON%20Reservation"

   변경:
   href="./reservation.html"

4. Vercel 배포가 Ready가 되면 아래 주소로 직접 확인할 수 있습니다.

   https://nice-moon.vercel.app/reservation.html

현재 신청 완료 동작은 연습용 화면입니다. 실제 이메일 발송이나 데이터 저장은 하지 않습니다.

V2 변경사항
- 예약 항목과 입력 글자 확대
- 랜덤 개수/속도의 우주선이 달 뒤로 지나가는 애니메이션
- 체험 프로그램 8종으로 확장
- 마사지 라운지 선택 시 전용 코스 드롭다운 표시
- Emperor Class와 God Class 추가
- 성별 및 우주복 피팅 사이즈 추가
