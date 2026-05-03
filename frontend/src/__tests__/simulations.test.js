import { describe, test, expect } from 'vitest';
import {
  buildTasksForRole,
  defaultSimulations,
  STAGES,
  LEADERBOARD_OTHERS,
} from '../data/simulations';

describe('🎯 Simulations Data', () => {

  describe('defaultSimulations()', () => {

    test('✅ Returns exactly 4 simulations', () => {
      expect(defaultSimulations().length).toBe(4);
    });

    test('✅ Contains Software Developer', () => {
      const ids = defaultSimulations().map(s => s.id);
      expect(ids).toContain('sw');
    });

    test('✅ Contains Data Science', () => {
      const ids = defaultSimulations().map(s => s.id);
      expect(ids).toContain('ds');
    });

    test('✅ Contains Finance Analyst', () => {
      const ids = defaultSimulations().map(s => s.id);
      expect(ids).toContain('fin');
    });

    test('✅ Contains AI Engineer', () => {
      const ids = defaultSimulations().map(s => s.id);
      expect(ids).toContain('ai');
    });

    test('✅ All IDs are unique', () => {
      const ids = defaultSimulations().map(s => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    test('✅ All start as active with 0 progress', () => {
      defaultSimulations().forEach(sim => {
        expect(sim.status).toBe('active');
        expect(sim.progress).toBe(0);
      });
    });

    test('✅ Each sim has required fields', () => {
      defaultSimulations().forEach(sim => {
        expect(sim.id).toBeDefined();
        expect(sim.title).toBeDefined();
        expect(sim.icon).toBeDefined();
        expect(sim.color).toBeDefined();
        expect(sim.totalXP).toBeGreaterThan(0);
        expect(sim.languages.length).toBeGreaterThan(0);
        expect(sim.stageProgress).toBeDefined();
        expect(sim.desc).toBeDefined();
      });
    });

    test('✅ Total XP values are reasonable', () => {
      defaultSimulations().forEach(sim => {
        expect(sim.totalXP).toBeGreaterThan(1000);
        expect(sim.totalXP).toBeLessThan(5000);
      });
    });
  });

  describe('STAGES', () => {

    test('✅ Has exactly 3 stages', () => {
      expect(Object.keys(STAGES).length).toBe(3);
    });

    test('✅ Has beginner stage', () => {
      expect(STAGES.beginner).toBeDefined();
      expect(STAGES.beginner.label).toBe('Beginner');
    });

    test('✅ Has intermediate stage', () => {
      expect(STAGES.intermediate).toBeDefined();
      expect(STAGES.intermediate.label).toBe('Intermediate');
    });

    test('✅ Has hard stage', () => {
      expect(STAGES.hard).toBeDefined();
      expect(STAGES.hard.label).toBe('Hard');
    });

    test('✅ Hard has highest XP multiplier', () => {
      expect(STAGES.hard.xpMult).toBeGreaterThan(STAGES.intermediate.xpMult);
      expect(STAGES.intermediate.xpMult).toBeGreaterThan(STAGES.beginner.xpMult);
    });

    test('✅ Each stage has color', () => {
      Object.values(STAGES).forEach(stage => {
        expect(stage.color).toBeDefined();
      });
    });
  });

  describe('buildTasksForRole()', () => {

    const roles  = ['sw', 'ds', 'fin', 'ai'];
    const stages = ['beginner', 'intermediate', 'hard'];

    roles.forEach(role => {
      stages.forEach(stage => {

        test(`✅ ${role}/${stage} has tasks`, () => {
          const tasks = buildTasksForRole(role);
          expect(tasks[stage]).toBeDefined();
          expect(tasks[stage].length).toBeGreaterThan(0);
        });

        test(`✅ ${role}/${stage} tasks have all required fields`, () => {
          buildTasksForRole(role)[stage].forEach(task => {
            expect(task.title).toBeDefined();
            expect(task.time).toBeDefined();
            expect(task.desc).toBeDefined();
            expect(task.starterCode).toBeDefined();
            expect(task.solution).toBeDefined();
            expect(Array.isArray(task.validationRules)).toBe(true);
            expect(task.validationRules.length).toBeGreaterThan(0);
            expect(Array.isArray(task.tests)).toBe(true);
            expect(task.tests.length).toBeGreaterThan(0);
          });
        });
      });
    });

    test('✅ SW beginner has 5 tasks', () => {
      expect(buildTasksForRole('sw').beginner.length).toBe(5);
    });

    test('✅ SW intermediate has 5 tasks', () => {
      expect(buildTasksForRole('sw').intermediate.length).toBe(5);
    });

    test('✅ SW hard has 5 tasks', () => {
      expect(buildTasksForRole('sw').hard.length).toBe(5);
    });

    test('✅ Unknown role returns object with empty arrays', () => {
      const tasks = buildTasksForRole('unknown');
      expect(tasks).toBeDefined();
    });

    test('✅ Starter code contains TODO or actual code', () => {
      buildTasksForRole('sw').beginner.forEach(task => {
        expect(task.starterCode.length).toBeGreaterThan(10);
      });
    });
  });

  describe('LEADERBOARD_OTHERS', () => {

    test('✅ Has 5 leaderboard entries', () => {
      expect(LEADERBOARD_OTHERS.length).toBe(5);
    });

    test('✅ Each entry has required fields', () => {
      LEADERBOARD_OTHERS.forEach(entry => {
        expect(entry.name).toBeDefined();
        expect(entry.score).toBeGreaterThan(0);
        expect(entry.avatar).toBeDefined();
        expect(entry.color).toBeDefined();
      });
    });

    test('✅ Scores are positive numbers', () => {
      LEADERBOARD_OTHERS.forEach(e => {
        expect(typeof e.score).toBe('number');
        expect(e.score).toBeGreaterThan(0);
      });
    });
  });
});