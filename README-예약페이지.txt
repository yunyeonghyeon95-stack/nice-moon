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
