# 네이버 검색광고 API Starter | Naver Search Ad API

[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[네이버 키워드 분석 도구](https://github.com/nextnove/naver-keyword-analyzer)로 이전

---

네이버 검색광고 API를 사용하기 위한 node.js 기본 구현 예제입니다. 인증, 서명 생성, API 호출 등 핵심 기능을 포함하고 있어 이 코드를 기반으로 다양한 기능을 확장할 수 있습니다.

## 🎯 프로젝트 목적

- 네이버 검색광고 API의 기본적인 사용법 제공
- HMAC-SHA256 서명 생성 및 인증 구현 예제
- 키워드 검색량 조회 API 사용 예제

## ✨ 포함된 기능

- **API 인증**: HMAC-SHA256 서명 생성 및 헤더 구성
- **키워드 검색량 조회**: `/keywordstool` API 호출 예제
- **배치 처리**: 5개 단위 자동 분할 처리
- **결과 포맷팅**: 콘솔 출력 예제
- **환경 변수 관리**: dotenv를 활용한 설정 관리

## 📋 사전 요구사항

- Node.js 18.0.0 이상
- 네이버 검색광고 계정 (무료 가입 가능)
- 네이버 검색광고 API 키 (무료 발급)

## 🚀 빠른 시작

### 1. 설치

```bash
git clone https://github.com/[your-username]/naver-search-ad-api.git
cd naver-search-ad-api
npm install
```

### 2. 네이버 검색광고 API 키 발급

1. [네이버 검색광고](https://searchad.naver.com) 접속 및 로그인
2. 상단 메뉴 **도구** → **API 사용 관리** 클릭
3. **API 키 발급** 버튼 클릭
4. API Key, Secret Key, Customer ID 복사

### 3. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열어 발급받은 값을 입력하세요:

```env
NAVER_API_KEY=your_api_key_here
NAVER_SECRET_KEY=your_secret_key_here
NAVER_CUSTOMER_ID=your_customer_id_here
```

### 4. 키워드 설정 및 실행

`src/index.js` 파일에서 조회할 키워드를 설정합니다:

```javascript
const TARGET_KEYWORDS = ['제주여행', '게스트하우스', '자전거여행'];
```

프로그램을 실행합니다:

```bash
npm start
```

## 📊 출력 예시

```
조회 키워드: 제주여행

========================================
   네이버 연관키워드 검색량 조회 결과
========================================

[ 연관키워드 순 ]
----------------------------------------
 1. 제주여행
    PC 검색수        : 15,300 (19.0%)
    모바일 검색수    : 65,300 (81.0%)
    총 검색수        : 80,600
    PC 클릭수        : 1,200 | 클릭률: 7.8%
    모바일 클릭수    : 5,100 | 클릭률: 7.8%
    월평균 광고노출수: 3
    경쟁 강도        : 높음

[ 검색량 순 (총 검색수 기준) ]
----------------------------------------
 1. 제주여행
    ...
```

## 🔧 고급 설정

`src/keyword-service.js` 파일에서 다음 설정을 변경할 수 있습니다:

```javascript
const MAX_KEYWORDS_PER_REQUEST = 5;  // API 요청당 최대 키워드 수
const MAX_RESULT_COUNT = 10;         // 출력할 최대 결과 수
const SORT_BY = 'total';             // 정렬 기준: 'total' | 'pc' | 'mobile'
```

## 📁 프로젝트 구조

```
naver-search-ad-api/
├── src/
│   ├── index.js            # 진입점 (키워드 입력 및 실행)
│   ├── api-client.js       # API 인증 및 HTTP 요청 처리
│   ├── keyword-service.js  # 검색량 조회 로직 (배치 처리, 정렬)
│   ├── signature.js        # HMAC-SHA256 서명 생성
│   └── formatter.js        # 콘솔 출력 포매터
├── .env                    # 환경 변수 (git에서 제외됨)
├── .env.example            # 환경 변수 템플릿
├── .gitignore
├── package.json
└── README.md
```

## 📖 API 응답 필드 설명

| 필드 | 설명 |
|---|---|
| `relKeyword` | 연관 키워드 |
| `monthlyPcQcCnt` | PC 월간 검색수 |
| `monthlyMobileQcCnt` | 모바일 월간 검색수 |
| `monthlyAvePcClkCnt` | PC 월평균 클릭수 |
| `monthlyAveMobileClkCnt` | 모바일 월평균 클릭수 |
| `monthlyAvePcCtr` | PC 클릭률 (%) |
| `monthlyAveMobileCtr` | 모바일 클릭률 (%) |
| `plAvgDepth` | 월평균 광고 노출 수 |
| `compIdx` | 경쟁 강도 (`낮음` / `보통` / `높음`) |

## ⚠️ 주의사항

- API는 한 번에 최대 5개 키워드만 처리 가능 (초과 시 자동 배치 처리)
- 검색량은 **월간** 기준입니다
- 검색량이 10 미만인 경우 API가 `10`으로 반환합니다
- API 키는 네이버 검색광고 계정이 필요합니다

## 🛠️ 기술 스택

- **Node.js**: ES Modules 사용
- **axios**: HTTP 요청 처리
- **dotenv**: 환경 변수 관리
- **crypto**: HMAC-SHA256 서명 생성 (Node.js 내장 모듈)

## � 코드 구조 설명

### API 클라이언트 (`api-client.js`)
- HMAC-SHA256 서명 생성 및 인증 헤더 구성
- 재사용 가능한 HTTP 요청 메서드 제공
- 다른 API 엔드포인트 호출 시 이 클래스를 확장하여 사용

### 키워드 서비스 (`keyword-service.js`)
- 비즈니스 로직 분리
- 배치 처리 및 데이터 가공
- 새로운 서비스 추가 시 이 패턴을 참고

### 서명 생성 (`signature.js`)
- 네이버 API 인증에 필요한 서명 생성
- 모든 API 요청에 공통으로 사용

## 🔗 참고 자료

- [네이버 검색광고 API 공식 문서](https://naver.github.io/searchad-apidoc/)
- [API 인증 가이드](https://naver.github.io/searchad-apidoc/#/guides/get-started)
- [키워드 도구 API 명세](https://naver.github.io/searchad-apidoc/#/operations/GET/~2Fkeywordstool)

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능합니다.