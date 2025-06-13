const { detectHallucination } = require('../../backend/compliance/lettuceDetect');

describe('LettuceDetect', () => {
  it('should flag hallucination on "lorem"', async () => {
    const result = await detectHallucination("this is lorem ipsum", []);
    expect(result.hallucinated).toBe(true);
  });

  it('should not flag on normal output', async () => {
    const result = await detectHallucination("task completed", []);
    expect(result.hallucinated).toBe(false);
  });
});
