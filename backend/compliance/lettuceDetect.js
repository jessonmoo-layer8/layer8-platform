// LettuceDetect: Hallucination detection for agent output (simulated for demo)

async function detectHallucination(output, groundingDocs) {
  // In production: Call ModernBERT or a similar detector
  // Here: If output contains "lorem", flag as hallucination
  const hallucinated = output.includes("lorem");
  return {
    hallucinated,
    score: hallucinated ? 0 : 1,
    flaggedSpans: hallucinated ? ["lorem"] : [],
    comment: hallucinated ? "Potential hallucination detected" : "All content grounded"
  };
}

module.exports = { detectHallucination };
