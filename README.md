# 안심이 공개 웹사이트

안심이는 시민의 생활 조건에서 재난안전 정보를 다시 묻고, 더 쓸 수 있는 공공서비스와 데이터를 실험하는 프로젝트입니다. 이 저장소는 공개 웹사이트 구동에 필요한 페이지와 공개 가능한 자산만 관리합니다.

## 저장소 역할

- `ansimi`: 공개 웹사이트 저장소
- `ansimi-archive`: 원본 자료, 내부 작업 기록, 비공개 검토 자료를 보관하는 아카이브 저장소

## 공개 전 확인 기준

- 개인정보, 연락처, 내부 회의 링크 제거
- 비공개 원본 문서와 작업용 스프레드시트 제거
- 공개 동의가 불명확한 이미지와 녹화 자료 제외
- 내부 분석 자료는 시민용 툴킷, 가이드북, 체크리스트 형태로 재편집한 뒤 공개
- 웹페이지 구동에 필요한 공개 자산만 `assets/`에 복사

## 페이지 구조

```text
index.html
blog.html
blog/
  2024-09-meethack-disaster-data-users.html
  2025-02-minimeet-safety-data-platform.html
  2025-04-meethack-disaster-bag.html
  2025-11-interview-disaster-preparedness.html
projects/
  index.html
  2024-disaster-app-ux.html
  2025-disaster-bag-workshop.html
  2026-shelter-data.html
assets/
  data/
    shelter-data-proposal.public.json
  images/
styles.css
script.js
```

정적 HTML, CSS, JavaScript만 사용합니다. GitHub Pages에서 바로 배포할 수 있습니다.

