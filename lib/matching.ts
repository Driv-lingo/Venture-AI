import { Opportunity, User } from '@prisma/client';

interface MatchResult {
  matchScore: number;
  skillsMatch: number;
  interestsMatch: number;
  capitalMatch: number;
  timeMatch: number;
  explanation: string;
}

/**
 * Calculate match score between a user and an opportunity
 * Weights: Skills (40%), Interests (30%), Capital (20%), Time (10%)
 */
export function calculateMatch(
  user: User,
  opportunity: Opportunity
): MatchResult {
  const skillsMatch = calculateSkillsMatch(user.skills, opportunity);
  const interestsMatch = calculateInterestsMatch(user.interests, opportunity);
  const capitalMatch = calculateCapitalMatch(user.capital, opportunity.startupCost);
  const timeMatch = calculateTimeMatch(user.timeCommitment, opportunity.timeToLaunchHours);

  // Weighted average
  const matchScore = Math.round(
    skillsMatch * 0.4 +
    interestsMatch * 0.3 +
    capitalMatch * 0.2 +
    timeMatch * 0.1
  );

  const explanation = generateMatchExplanation(
    matchScore,
    skillsMatch,
    interestsMatch,
    capitalMatch,
    timeMatch,
    opportunity
  );

  return {
    matchScore,
    skillsMatch,
    interestsMatch,
    capitalMatch,
    timeMatch,
    explanation,
  };
}

function calculateSkillsMatch(userSkills: string[], opportunity: Opportunity): number {
  if (!userSkills || userSkills.length === 0) return 50; // Neutral score

  const opportunitySkills = extractSkillsFromOpportunity(opportunity);
  const matchingSkills = userSkills.filter(skill =>
    opportunitySkills.some(oppSkill =>
      oppSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(oppSkill.toLowerCase())
    )
  );

  const matchPercentage = (matchingSkills.length / Math.max(userSkills.length, opportunitySkills.length)) * 100;
  return Math.min(100, Math.round(matchPercentage * 1.5)); // Boost to make more generous
}

function extractSkillsFromOpportunity(opportunity: Opportunity): string[] {
  const skills: string[] = [];
  const text = `${opportunity.title} ${opportunity.description} ${opportunity.niche}`.toLowerCase();

  // Common skill keywords
  const skillKeywords = [
    'marketing', 'seo', 'content', 'writing', 'design', 'development',
    'coding', 'programming', 'sales', 'social media', 'analytics',
    'copywriting', 'video', 'photography', 'ecommerce', 'dropshipping',
    'consulting', 'coaching', 'teaching', 'customer service', 'management'
  ];

  skillKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      skills.push(keyword);
    }
  });

  return skills;
}

function calculateInterestsMatch(userInterests: string[], opportunity: Opportunity): number {
  if (!userInterests || userInterests.length === 0) return 50; // Neutral score

  const opportunityTopics = [
    opportunity.niche.toLowerCase(),
    ...opportunity.keySuccessFactors.map((f: string) => f.toLowerCase()),
  ];

  const matchingInterests = userInterests.filter(interest =>
    opportunityTopics.some(topic =>
      topic.includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(topic)
    )
  );

  const matchPercentage = (matchingInterests.length / userInterests.length) * 100;
  return Math.min(100, Math.round(matchPercentage * 1.3)); // Boost to make more generous
}

function calculateCapitalMatch(userCapital: string | null, startupCost: number): number {
  if (!userCapital) return 50; // Neutral score

  const capitalRanges: Record<string, { min: number; max: number }> = {
    'under1k': { min: 0, max: 1000 },
    '1k-5k': { min: 1000, max: 5000 },
    '5k-plus': { min: 5000, max: 1000000 },
  };

  const range = capitalRanges[userCapital];
  if (!range) return 50;

  if (startupCost <= range.max) {
    return 100;
  } else if (startupCost <= range.max * 1.5) {
    return 70;
  } else if (startupCost <= range.max * 2) {
    return 40;
  } else {
    return 20;
  }
}

function calculateTimeMatch(
  userTimeCommitment: string | null,
  timeToLaunchHours: number
): number {
  if (!userTimeCommitment) return 50; // Neutral score

  const timeCommitmentHours: Record<string, number> = {
    'sideHustle': 10, // 10 hours per week
    'partTime': 20, // 20 hours per week
    'fullTime': 40, // 40 hours per week
  };

  const availableHoursPerWeek = timeCommitmentHours[userTimeCommitment];
  if (!availableHoursPerWeek) return 50;

  const weeksToLaunch = timeToLaunchHours / availableHoursPerWeek;

  if (weeksToLaunch <= 4) {
    return 100; // Can launch in a month
  } else if (weeksToLaunch <= 8) {
    return 80; // Can launch in 2 months
  } else if (weeksToLaunch <= 12) {
    return 60; // Can launch in 3 months
  } else {
    return 40; // Takes longer than 3 months
  }
}

function generateMatchExplanation(
  matchScore: number,
  skillsMatch: number,
  interestsMatch: number,
  capitalMatch: number,
  timeMatch: number,
  opportunity: Opportunity
): string {
  const reasons: string[] = [];

  if (skillsMatch >= 70) {
    reasons.push('Your skills align well with this opportunity');
  } else if (skillsMatch < 50) {
    reasons.push('You may need to develop new skills for this');
  }

  if (interestsMatch >= 70) {
    reasons.push('This matches your interests perfectly');
  }

  if (capitalMatch >= 80) {
    reasons.push('The startup cost fits your budget');
  } else if (capitalMatch < 50) {
    reasons.push('This requires more capital than you indicated');
  }

  if (timeMatch >= 80) {
    reasons.push('You can launch this within your time commitment');
  }

  if (opportunity.difficulty === 'easy') {
    reasons.push('This is beginner-friendly');
  }

  if (opportunity.competitionLevel === 'low') {
    reasons.push('Low competition makes this easier to enter');
  }

  if (reasons.length === 0) {
    reasons.push('This opportunity has potential for you');
  }

  return reasons.join('. ') + '.';
}
