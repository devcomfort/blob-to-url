import { describe, it, expect } from 'vitest';

describe('Edge Runtime 환경 테스트', () => {
  it('URL 및 전역 객체가 올바르게 설정되어 있어야 함', () => {
    // URL 객체 확인
    expect(typeof URL).toBe('function');
    expect(typeof URL.createObjectURL).toBe('function');
    expect(typeof URL.revokeObjectURL).toBe('function');

    // Blob 객체 확인
    expect(typeof Blob).toBe('function');

    // fetch 함수 확인
    expect(typeof fetch).toBe('function');

    // 환경 정보 출력
    console.log('Edge Runtime 환경 정보:');
    console.log('- URL 객체: 존재함');
    console.log('- createObjectURL 메소드: 존재함');
    console.log('- Blob 객체: 존재함');
    console.log('- fetch 함수: 존재함');
  });

  it('Blob URL 생성 및 요청 테스트', async () => {
    // Blob 생성
    const testBlob = new Blob(['테스트 내용'], { type: 'text/plain' });
    
    // Blob URL 생성
    const url = URL.createObjectURL(testBlob);
    
    // URL 형식 확인
    expect(url).toMatch(/^blob:/);
    
    // fetch 요청
    const response = await fetch(url);
    expect(response.ok).toBeTruthy();
    
    // 내용 확인
    const text = await response.text();
    console.log('Blob URL 응답 내용:', text);
    
    // URL 해제
    URL.revokeObjectURL(url);
  });
}); 