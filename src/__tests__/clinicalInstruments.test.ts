import { describe, it, expect } from 'vitest';
import { calculateScore, getInterpretation, GAD7, PHQ9 } from '@/lib/clinicalInstruments';

describe('Clinical Instruments', () => {
  describe('GAD-7', () => {
    it('should calculate score correctly', () => {
      const answers = {
        gad7_1: 2,
        gad7_2: 2,
        gad7_3: 2,
        gad7_4: 1,
        gad7_5: 1,
        gad7_6: 1,
        gad7_7: 1,
      };
      
      const score = calculateScore(GAD7, answers);
      expect(score).toBe(10);
    });

    it('should provide correct interpretation for minimal anxiety', () => {
      const score = 3;
      const interpretation = getInterpretation(GAD7, score);
      expect(interpretation).toBe('Anxiété minimale');
    });

    it('should provide correct interpretation for severe anxiety', () => {
      const score = 18;
      const interpretation = getInterpretation(GAD7, score);
      expect(interpretation).toBe('Anxiété sévère');
    });
  });

  describe('PHQ-9', () => {
    it('should calculate score correctly', () => {
      const answers = {
        phq9_1: 1,
        phq9_2: 1,
        phq9_3: 2,
        phq9_4: 2,
        phq9_5: 1,
        phq9_6: 0,
        phq9_7: 1,
        phq9_8: 0,
        phq9_9: 0,
      };
      
      const score = calculateScore(PHQ9, answers);
      expect(score).toBe(8);
    });

    it('should provide correct interpretation for minimal depression', () => {
      const score = 2;
      const interpretation = getInterpretation(PHQ9, score);
      expect(interpretation).toBe('Dépression minimale');
    });

    it('should provide correct interpretation for moderate depression', () => {
      const score = 12;
      const interpretation = getInterpretation(PHQ9, score);
      expect(interpretation).toBe('Dépression modérée');
    });
  });
});
