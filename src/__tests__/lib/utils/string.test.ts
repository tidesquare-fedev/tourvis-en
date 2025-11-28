/**
 * string 유틸리티 함수 테스트
 */

import {
  stripEmoji,
  extractFirstEmoji,
  safeParseNumber,
  safeParseInt,
  safeParseBoolean,
  isValidString,
  safeString,
} from '@/lib/utils/string';

describe('string utils', () => {
  describe('stripEmoji', () => {
    it('이모지를 제거하고 텍스트만 반환한다', () => {
      expect(stripEmoji('안녕하세요 👋')).toBe('안녕하세요');
      expect(stripEmoji('🎉 축하합니다! 🎊')).toBe('축하합니다!');
      expect(stripEmoji('테스트')).toBe('테스트');
    });

    it('서로게이트 페어를 제거한다', () => {
      expect(stripEmoji('😀😁😂')).toBe('');
      expect(stripEmoji('Hello 😊 World')).toBe('Hello  World');
    });

    it('변형 선택자를 제거한다', () => {
      expect(stripEmoji('❤️')).toBe('❤');
      expect(stripEmoji('👍🏽')).toBe('👍');
    });

    it('빈 문자열을 처리한다', () => {
      expect(stripEmoji('')).toBe('');
    });
  });

  describe('extractFirstEmoji', () => {
    it('첫 번째 이모지를 추출한다', () => {
      expect(extractFirstEmoji('안녕하세요 👋')).toBe('👋');
      expect(extractFirstEmoji('🎉 축하합니다! 🎊')).toBe('🎉');
      expect(extractFirstEmoji('😀😁😂')).toBe('😀');
    });

    it('이모지가 없으면 빈 문자열을 반환한다', () => {
      expect(extractFirstEmoji('안녕하세요')).toBe('');
      expect(extractFirstEmoji('')).toBe('');
    });
  });

  describe('safeParseNumber', () => {
    it('유효한 숫자를 반환한다', () => {
      expect(safeParseNumber(123)).toBe(123);
      expect(safeParseNumber('456')).toBe(456);
      expect(safeParseNumber('123.45')).toBe(123.45);
    });

    it('잘못된 값에 대해 기본값을 반환한다', () => {
      expect(safeParseNumber('abc')).toBe(0);
      expect(safeParseNumber(null)).toBe(0);
      expect(safeParseNumber(undefined)).toBe(0);
      expect(safeParseNumber({})).toBe(0);
    });

    it('커스텀 기본값을 사용한다', () => {
      expect(safeParseNumber('abc', 999)).toBe(999);
      expect(safeParseNumber(null, -1)).toBe(-1);
    });
  });

  describe('safeParseInt', () => {
    it('유효한 정수를 반환한다', () => {
      expect(safeParseInt(123)).toBe(123);
      expect(safeParseInt('456')).toBe(456);
      expect(safeParseInt('123.45')).toBe(123);
    });

    it('잘못된 값에 대해 기본값을 반환한다', () => {
      expect(safeParseInt('abc')).toBe(0);
      expect(safeParseInt(null)).toBe(0);
      expect(safeParseInt(undefined)).toBe(0);
    });

    it('커스텀 기본값을 사용한다', () => {
      expect(safeParseInt('abc', 999)).toBe(999);
    });
  });

  describe('safeParseBoolean', () => {
    it('유효한 불린 값을 반환한다', () => {
      expect(safeParseBoolean(true)).toBe(true);
      expect(safeParseBoolean(false)).toBe(false);
      expect(safeParseBoolean('true')).toBe(true);
      expect(safeParseBoolean('false')).toBe(false);
      expect(safeParseBoolean('1')).toBe(true);
      expect(safeParseBoolean('0')).toBe(false);
      expect(safeParseBoolean('yes')).toBe(true);
      expect(safeParseBoolean('no')).toBe(false);
    });

    it('잘못된 값에 대해 기본값을 반환한다', () => {
      expect(safeParseBoolean('abc')).toBe(false);
      expect(safeParseBoolean(null)).toBe(false);
      expect(safeParseBoolean(undefined)).toBe(false);
      expect(safeParseBoolean(123)).toBe(true);
    });

    it('커스텀 기본값을 사용한다', () => {
      expect(safeParseBoolean('abc', true)).toBe(true);
    });
  });

  describe('isValidString', () => {
    it('유효한 문자열을 올바르게 식별한다', () => {
      expect(isValidString('hello')).toBe(true);
      expect(isValidString('안녕하세요')).toBe(true);
      expect(isValidString('123')).toBe(true);
    });

    it('무효한 값을 올바르게 식별한다', () => {
      expect(isValidString('')).toBe(false);
      expect(isValidString('   ')).toBe(false);
      expect(isValidString(null)).toBe(false);
      expect(isValidString(undefined)).toBe(false);
      expect(isValidString(123)).toBe(false);
      expect(isValidString({})).toBe(false);
    });
  });

  describe('safeString', () => {
    it('유효한 문자열을 그대로 반환한다', () => {
      expect(safeString('hello')).toBe('hello');
      expect(safeString('안녕하세요')).toBe('안녕하세요');
    });

    it('무효한 값에 대해 기본값을 반환한다', () => {
      expect(safeString('')).toBe('');
      expect(safeString('   ')).toBe('');
      expect(safeString(null)).toBe('');
      expect(safeString(undefined)).toBe('');
      expect(safeString(123)).toBe('');
    });

    it('커스텀 기본값을 사용한다', () => {
      expect(safeString('', 'default')).toBe('default');
      expect(safeString(null, 'fallback')).toBe('fallback');
    });
  });
});
