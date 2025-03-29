import { vi } from 'vitest';

// Edge Runtime 환경 전역 객체 모킹
if (typeof globalThis.URL === 'undefined') {
  // URL 객체 모킹
  globalThis.URL = class URL {
    static createObjectURL(blob: Blob): string {
      // 간단한 가짜 URL 생성
      return `blob:test-${Math.random().toString(36).substring(7)}`;
    }

    static revokeObjectURL(url: string): void {
      // URL 해제 모킹 - 실제 동작 없음
    }

    constructor(url: string | URL, base?: string | URL) {
      this.href = url.toString();
    }

    href: string;
    toString(): string {
      return this.href;
    }
  } as any;
}

// Blob URL fetch 모킹
const originalFetch = globalThis.fetch;
globalThis.fetch = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
  const url = input.toString();
  
  // Blob URL 요청 감지 (blob: 로 시작하는 URL)
  if (url.startsWith('blob:')) {
    // 일반 요청 성공으로 모킹
    return new Response('Mocked blob content', { status: 200 });
  }
  
  // 다른 일반 요청은 원래 fetch로 처리
  if (originalFetch) {
    return originalFetch(input, init);
  }
  
  // fetch가 없는 환경에서는 간단한 Response 반환
  return new Response('', { status: 404 });
}); 