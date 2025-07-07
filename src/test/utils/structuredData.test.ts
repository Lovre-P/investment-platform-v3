import { describe, it, expect } from 'vitest';
import { createInvestmentSchema, createBreadcrumbSchema, organizationSchema } from '../../../utils/structuredData';
import type { Investment } from '../../../types';

describe('Structured Data Utils', () => {
  describe('createInvestmentSchema', () => {
    const mockInvestment: Investment = {
      id: '1',
      title: 'Test Investment',
      description: 'Test investment description',
      amountGoal: 100000,
      amountRaised: 50000,
      currency: 'EUR',
      category: 'Real Estate',
      status: 'Open',
      submissionDate: '2024-01-01',
      submittedBy: 'test@example.com',
      apyRange: '8-12%',
      minInvestment: 1000,
      term: '3 years',
      images: ['https://example.com/image.jpg']
    };

    it('should create valid investment schema', () => {
      const schema = createInvestmentSchema(mockInvestment);
      
      expect(schema).toBeDefined();
      expect(schema?.['@type']).toBe('Service');
      expect(schema?.name).toBe(mockInvestment.title);
      expect(schema?.description).toBe(mockInvestment.description);
      expect(schema?.serviceType).toBe('Investment Opportunity');
    });

    it('should return null for invalid investment data', () => {
      const invalidInvestment = { id: '1' } as Investment;
      const schema = createInvestmentSchema(invalidInvestment);
      
      expect(schema).toBeNull();
    });

    it('should include offers with correct availability', () => {
      const schema = createInvestmentSchema(mockInvestment);
      
      expect(schema?.offers).toBeDefined();
      expect(schema?.offers['@type']).toBe('Offer');
      expect(schema?.offers.price).toBe(mockInvestment.amountGoal);
      expect(schema?.offers.priceCurrency).toBe(mockInvestment.currency);
      expect(schema?.offers.availability).toBe('https://schema.org/InStock');
    });
  });

  describe('createBreadcrumbSchema', () => {
    it('should create valid breadcrumb schema', () => {
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Investments', url: '/investments' },
        { name: 'Test Investment', url: '/investments/1' }
      ];

      const schema = createBreadcrumbSchema(breadcrumbs);
      
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[0].name).toBe('Home');
    });
  });

  describe('organizationSchema', () => {
    it('should have valid organization structure', () => {
      expect(organizationSchema['@type']).toBe('Organization');
      expect(organizationSchema.name).toBe('MegaInvest');
      expect(organizationSchema.url).toBe('https://www.mega-invest.hr');
      expect(organizationSchema.contactPoint).toBeDefined();
      expect(organizationSchema.address).toBeDefined();
    });
  });
});
