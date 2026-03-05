const MAX_KEYWORDS_PER_REQUEST = 5; // 네이버 검색광고 API는 한 번에 최대 5개의 키워드에 대한 검색량 정보를 반환
const MAX_RESULT_COUNT = 10; // API에서 반환된 전체 결과 중 상위 N개만 사용

// 검색량 정렬 기준: 'total' | 'pc' | 'mobile'
const SORT_BY = 'total';

export class KeywordService {
    #client; // API 클라이언트 인스턴스

    constructor(client) {
        this.#client = client;
    }

    #chunkArray(arr, size) {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    }

    async #fetchBatch(keywords) {
        return this.#client.request('GET', '/keywordstool', {
            params: {
                hintKeywords: keywords.join(','),
                showDetail: '1'
            }
        });
    }

    #mapItem(item) {
        const pc     = item.monthlyPcQcCnt ?? 0;
        const mobile = item.monthlyMobileQcCnt ?? 0;
        const total  = pc + mobile;

        const pcPct     = total > 0 ? ((pc / total) * 100).toFixed(1) : '0.0';
        const mobilePct = total > 0 ? ((mobile / total) * 100).toFixed(1) : '0.0';

        // 월 평균 PC/모바일 클릭수
        const pcClkCnt     = item.monthlyAvePcClkCnt ?? 0;
        const mobileClkCnt = item.monthlyAveMobileClkCnt ?? 0;

        // 월 평균 PC/모바일 클릭률
        const pcCtr     = item.monthlyAvePcCtr ?? 0;
        const mobileCtr = item.monthlyAveMobileCtr ?? 0;

        // 월 평균 광고 노출 수 (= 상위노출 유지기간 대용)
        const plAvgDepth = item.plAvgDepth ?? 0;

        // 경쟁 강도: '낮음' | '보통' | '높음'
        const compIdx = item.compIdx ?? '-';

        return {
            keyword: item.relKeyword,
            pc,
            mobile,
            total,
            pcPct,
            mobilePct,
            pcClkCnt,
            mobileClkCnt,
            pcCtr,
            mobileCtr,
            plAvgDepth,
            compIdx
        };
    }

    async getSearchVolume(keywords) {
        const keywordList = Array.isArray(keywords) ? keywords : [keywords];
        const chunks = this.#chunkArray(keywordList, MAX_KEYWORDS_PER_REQUEST);

        const raw = [];
        for (const chunk of chunks) {
            const data = await this.#fetchBatch(chunk);
            raw.push(...(data.keywordList ?? []));
        }

        const mapped = raw.map(item => this.#mapItem(item));

        // 1. 연관키워드 순 (API 응답 순서 그대로)
        const byRelated = mapped.slice(0, MAX_RESULT_COUNT);

        // 2. 검색량 순 (정렬 후 상위 N개)
        const byVolume = [...mapped]
            .sort((a, b) => b[SORT_BY] - a[SORT_BY])
            .slice(0, MAX_RESULT_COUNT);

        return { byRelated, byVolume };
    }
}