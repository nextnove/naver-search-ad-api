import 'dotenv/config';
import { NaverAdApiClient } from './api-client.js';
import { KeywordService } from './keyword-service.js';
import { printResult } from './formatter.js';

// ✏️ 조회할 키워드를 여기에 입력하세요 (5개 초과 시 자동으로 나눠서 요청)
const TARGET_KEYWORDS = ['제주여행'];

// --- 환경 변수 검증 ---
const { NAVER_API_KEY, NAVER_SECRET_KEY, NAVER_CUSTOMER_ID } = process.env;

if (!NAVER_API_KEY || !NAVER_SECRET_KEY || !NAVER_CUSTOMER_ID) {
    console.error('❌ 환경 변수가 설정되지 않았습니다.');
    console.error('   .env.example을 복사해 .env 파일을 만들고 값을 채워주세요.');
    process.exit(1);
}

// --- 초기화 ---
const client = new NaverAdApiClient({
    apiKey: NAVER_API_KEY,
    secretKey: NAVER_SECRET_KEY,
    customerId: NAVER_CUSTOMER_ID
});

const keywordService = new KeywordService(client);

async function main() {
    const keywords = TARGET_KEYWORDS

    try {
        console.log(`\n조회 키워드: ${keywords.join(', ')}`);
        const results = await keywordService.getSearchVolume(keywords);
        printResult(results);
    } catch (error) {
        console.error('\n[Error]');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data:`, error.response.data);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

main();