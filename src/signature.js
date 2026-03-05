import { createHmac } from 'crypto';

/**
 * Signature 클래스는 네이버 검색광고 API 요청에 필요한 HMAC-SHA256 서명을 생성하는 기능을 제공합니다.
 */
export class Signature {
    static generate(timestamp, method, uri, secretKey) {
        const message = `${timestamp}.${method}.${uri}`;
        const hmac = createHmac('sha256', secretKey);
        hmac.update(message, 'utf-8');
        return hmac.digest('base64');
    }
}