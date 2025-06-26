# 이창현 BIGS 프론트엔드 개발자 채용 과제

<p align="center">
  <img src="https://via.placeholder.com/150" alt="BIGS Logo" />
</p>

이 프로젝트는 **BIGS 프론트엔드 개발자 채용 과제**를 위해 제작된 **React** 기반 웹 게시판 애플리케이션입니다. **Vite**를 빌드 도구로 사용하며, **Tailwind CSS**로 반응형 UI를 구현했습니다.

## 📋 프로젝트 개요

- **프레임워크**: React 18 (Vite 기반)
- **빌드 도구**: Vite – 빠르고 현대적인 프론트엔드 빌드 도구
- **스타일링**: Tailwind CSS – 유틸리티 기반 CSS 프레임워크
- **API 클라이언트**: Axios – HTTP 요청 및 토큰 관리
- **상태 관리**: React Context 및 useReducer
- **라우팅**: React Router DOM
- **인증**: JWT 기반 (액세스/리프레시 토큰)
- **주요 기능**:
  - 회원가입, 로그인, 로그아웃, 토큰 갱신
  - 게시글 작성/수정/삭제/조회/목록 조회
  - 파일 업로드 (선택적), 페이지네이션, 카테고리 선택

## 🛠️ 요구사항

- **Node.js**: v16 이상
- **npm**: v8 이상
- **Git**: 최신 버전
- **브라우저**: Chrome, Firefox 등 최신 브라우저

## 📦 의존성

`npm install` 실행 시 아래 라이브러리가 자동 설치됩니다:

| 라이브러리             | 용도                                      | 버전       |
|------------------------|------------------------------------------|------------|
| `react`               | React 프레임워크                         | ^18.2.0   |
| `react-router-dom`    | 클라이언트 사이드 라우팅                 | ^6.14.0   |
| `axios`               | API 요청 및 토큰 관리                    | ^1.7.2    |
| `jwt-decode`          | JWT 토큰 디코딩                          | ^4.0.0    |
| `tailwindcss`         | 유틸리티 기반 스타일링                   | ^3.4.3    |
| `@tailwindcss/forms`  | Tailwind CSS 폼 스타일링 플러그인        | ^0.5.7    |
| `postcss`             | Tailwind CSS 빌드 프로세스 지원           | ^8.4.24   |
| `autoprefixer`        | CSS 호환성 접두사 추가                   | ^10.4.14  |

### Tailwind CSS 설정
Tailwind CSS는 `tailwind.config.js`, `postcss.config.js`, `src/index.css`에 설정되어 있습니다. 별도 설정 없이 `npm run dev`로 사용 가능:
- **`tailwind.config.js`**: React 파일 스캔 및 `@tailwindcss/forms` 플러그인 포함
- **`postcss.config.js`**: Tailwind와 Autoprefixer 통합
- **`src/index.css`**: Tailwind 디렉티브(`@tailwind base`, `@components`, `@utilities`) 포함

## 🚀 설치 및 실행 방법

1. **리포지토리 클론**
   ```bash
   git clone <your-repository-url>
   cd bigs-frontend
  받으신 후 npm i 하시고 npm run dev로 실행 부탁드립니다.

감사합니다.
