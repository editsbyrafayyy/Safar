export interface PersonaDNA {
  heritage: number;    // 0-1
  culinary: number;
  urban: number;
  nature: number;
  adventure: number;
  relaxation: number;
}

export interface TravelerPreferences {
  personaDNA: PersonaDNA;
  travelStyle: string;    // "Luxury" | "Budget" | "Backpacker" | "Comfort" | "Adventure"
  travelPace: string;     // "Slow" | "Moderate" | "Fast"
  interestTags: string[]; // ["Heritage", "Food", "Photography", ...]
  preferredRegions?: string[];
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return magA && magB ? dot / (magA * magB) : 0;
}

export function computeMatchScore(p1: TravelerPreferences, p2: TravelerPreferences): number {
  // 1. DNA similarity (40% weight) — cosine similarity of 6-axis vectors
  const dnaScore = cosineSimilarity(
    [p1.personaDNA.heritage, p1.personaDNA.culinary, p1.personaDNA.urban, p1.personaDNA.nature, p1.personaDNA.adventure, p1.personaDNA.relaxation],
    [p2.personaDNA.heritage, p2.personaDNA.culinary, p2.personaDNA.urban, p2.personaDNA.nature, p2.personaDNA.adventure, p2.personaDNA.relaxation]
  );

  // 2. Travel style match (20% weight) — exact match = 1, different = 0.3
  const styleScore = p1.travelStyle === p2.travelStyle ? 1 : 0.3;

  // 3. Travel pace match (20% weight)
  const paceScore = p1.travelPace === p2.travelPace ? 1 : 0.4;

  // 4. Shared interest tags (20% weight) — Jaccard similarity
  const tags1 = p1.interestTags || [];
  const tags2 = p2.interestTags || [];
  const sharedTags = tags1.filter(t => tags2.includes(t));
  const unionTags = new Set([...tags1, ...tags2]);
  const tagScore = unionTags.size > 0 ? sharedTags.length / unionTags.size : 0;

  // Weighted sum
  const rawScore = (dnaScore * 0.40) + (styleScore * 0.20) + (paceScore * 0.20) + (tagScore * 0.20);
  return Math.round(rawScore * 100); // Return 0-100
}
