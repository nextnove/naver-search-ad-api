function printSection(title, results) {
    console.log(`\n[ ${title} ]`);
    console.log('----------------------------------------');

    results.forEach(({
        keyword, pc, mobile, total, pcPct, mobilePct,
        pcClkCnt, mobileClkCnt, pcCtr, mobileCtr,
        plAvgDepth, compIdx
    }, index) => {
        console.log(`${String(index + 1).padStart(2)}. ${keyword}`);
        console.log(`    PC 검색수        : ${pc.toLocaleString()} (${pcPct}%)`);
        console.log(`    모바일 검색수    : ${mobile.toLocaleString()} (${mobilePct}%)`);
        console.log(`    총 검색수        : ${total.toLocaleString()}`);
        console.log(`    PC 클릭수        : ${pcClkCnt.toLocaleString()} | 클릭률: ${pcCtr}%`);
        console.log(`    모바일 클릭수    : ${mobileClkCnt.toLocaleString()} | 클릭률: ${mobileCtr}%`);
        console.log(`    월평균 광고노출수: ${plAvgDepth}`);
        console.log(`    경쟁 강도        : ${compIdx}`);
    });
}

export function printResult({ byRelated, byVolume }) {
    console.log('\n========================================');
    console.log('   네이버 연관키워드 검색량 조회 결과');
    console.log('========================================');

    printSection('연관키워드 순', byRelated);
    printSection('검색량 순 (총 검색수 기준)', byVolume);

    console.log('\n========================================\n');
}