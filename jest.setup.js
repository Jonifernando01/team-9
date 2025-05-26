import { jest } from "@jest/globals"
import "@testing-library/jest-dom"

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: jest.fn(() => 'test-uuid-' + Math.random().toString(36).substring(2, 15))
  },
  writable: true
})

// Mock localStorage dengan Object.defineProperty
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
})

// Mock console methods
Object.defineProperty(global, 'console', {
  value: {
    ...console,
    error: jest.fn(),
    warn: jest.fn(),
    log: jest.fn(),
  },
  writable: true
})