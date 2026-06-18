describe('Conversion Rate Logic', () => {
  it('should return null when no quotes exist', () => {
    const totalQuotesCount = 0;
    const approvedQuotesCount = 0;
    
    const conversionRate = totalQuotesCount > 0
      ? (approvedQuotesCount / totalQuotesCount) * 100
      : null;
    
    expect(conversionRate).toBeNull();
  });

  it('should calculate conversion rate correctly when quotes exist', () => {
    const totalQuotesCount = 5;
    const approvedQuotesCount = 2;
    
    const conversionRate = totalQuotesCount > 0
      ? (approvedQuotesCount / totalQuotesCount) * 100
      : null;
    
    expect(conversionRate).toBe(40); // 2/5 * 100 = 40
  });

  it('should handle zero approved quotes', () => {
    const totalQuotesCount = 10;
    const approvedQuotesCount = 0;
    
    const conversionRate = totalQuotesCount > 0
      ? (approvedQuotesCount / totalQuotesCount) * 100
      : null;
    
    expect(conversionRate).toBe(0);
  });

  it('should handle 100% conversion rate', () => {
    const totalQuotesCount = 8;
    const approvedQuotesCount = 8;
    
    const conversionRate = totalQuotesCount > 0
      ? (approvedQuotesCount / totalQuotesCount) * 100
      : null;
    
    expect(conversionRate).toBe(100);
  });
});