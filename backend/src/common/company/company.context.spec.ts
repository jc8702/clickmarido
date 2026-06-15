import { CompanyContext } from './company.context';

describe('CompanyContext', () => {
  it('should run in context and retrieve values', () => {
    CompanyContext.run({ companyId: 'company-1', userId: 'user-1' }, () => {
      expect(CompanyContext.getCompanyId()).toBe('company-1');
      expect(CompanyContext.getUserId()).toBe('user-1');
    });
  });

  it('should return undefined if no context', () => {
    expect(CompanyContext.getCompanyId()).toBeUndefined();
    expect(CompanyContext.getUserId()).toBeUndefined();
  });
});
