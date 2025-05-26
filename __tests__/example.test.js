describe('Simple Tests', () => {
  it('should pass basic math', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle arrays', () => {
    const arr = [1, 2, 3]
    expect(arr.length).toBe(3)
  })

  it('should handle objects', () => {
    const obj = { name: 'test' }
    expect(obj.name).toBe('test')
  })
})