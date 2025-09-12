import { ApiClient, validateEmail, validatePhone } from '../api'

describe('ApiClient', () => {
  let apiClient: ApiClient

  beforeEach(() => {
    apiClient = new ApiClient('https://api.example.com')
  })

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.kr')).toBe(true)
      expect(validateEmail('test+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('validatePhone', () => {
    it('should validate correct Korean phone numbers', () => {
      expect(validatePhone('010-1234-5678')).toBe(true)
      expect(validatePhone('01012345678')).toBe(true)
      expect(validatePhone('010 1234 5678')).toBe(true)
      expect(validatePhone('02-1234-5678')).toBe(true)
    })

    it('should reject invalid phone numbers', () => {
      expect(validatePhone('123-456-789')).toBe(false)
      expect(validatePhone('010-123-45')).toBe(false)
      expect(validatePhone('abc-def-ghij')).toBe(false)
      expect(validatePhone('')).toBe(false)
    })
  })

  describe('request method', () => {
    it('should make GET requests', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: 'test' }),
      })
      global.fetch = mockFetch

      const result = await apiClient.get('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.example.com/test',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result.success).toBe(true)
    })

    it('should handle request errors', async () => {
      const mockFetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' }),
      })
      global.fetch = mockFetch

      await expect(apiClient.get('/test')).rejects.toThrow()
    })
  })
})
