import { OpportunityDto, OpportunityStage, OpportunitySource } from "@/providers/opportunityProvider/types";

export interface DealSimilarityResult {
  opportunityId: string;
  similarityScore: number;
  dealTitle: string | null;
  clientName: string | null;
  estimatedValue: number;
  currency: string | null;
  stage: OpportunityStage;
  stageName: string | null;
  expectedCloseDate: string | null;
  actualCloseDate: string | null;
  description: string | null;
  source: OpportunitySource;
  daysToClose: number | null;
  successFactors: string[];
  riskFactors: string[];
}

export interface DealSimilarityEngine {
  findSimilarDeals(
    newOpportunity: CreateSimilarOpportunityDto,
    historicalDeals: OpportunityDto[]
  ): DealSimilarityResult[];
}

export interface CreateSimilarOpportunityDto {
  title: string | null;
  clientId: string;
  clientName: string | null;
  contactId: string | null;
  contactName: string | null;
  estimatedValue: number;
  currency: string | null;
  probability: number;
  source: OpportunitySource;
  expectedCloseDate: string | null;
  description: string | null;
}

class DealSimilarityEngineImpl implements DealSimilarityEngine {
  private readonly MAX_RESULTS = 3;
  private readonly WEIGHTS = {
    value: 0.3,
    client: 0.25,
    source: 0.15,
    description: 0.15,
    stage: 0.1,
    timeFrame: 0.05
  };

  findSimilarDeals(
    newOpportunity: CreateSimilarOpportunityDto,
    historicalDeals: OpportunityDto[]
  ): DealSimilarityResult[] {
    const scoredDeals = historicalDeals
      .filter(deal => this.isValidHistoricalDeal(deal))
      .map(deal => ({
        deal,
        score: this.calculateSimilarityScore(newOpportunity, deal)
      }))
      .filter(({ score }) => score > 0.1) // Only include deals with meaningful similarity
      .sort((a, b) => b.score - a.score)
      .slice(0, this.MAX_RESULTS);

    return scoredDeals.map(({ deal, score }) => ({
      opportunityId: deal.id,
      similarityScore: Math.round(score * 100),
      dealTitle: deal.title,
      clientName: deal.clientName,
      estimatedValue: deal.estimatedValue,
      currency: deal.currency,
      stage: deal.stage,
      stageName: deal.stageName,
      expectedCloseDate: deal.expectedCloseDate,
      actualCloseDate: deal.actualCloseDate,
      description: deal.description,
      source: deal.source,
      daysToClose: this.calculateDaysToClose(deal),
      successFactors: this.extractSuccessFactors(deal),
      riskFactors: this.extractRiskFactors(deal)
    }));
  }

  private isValidHistoricalDeal(deal: OpportunityDto): boolean {
    // Only consider deals that have been closed (won or lost)
    return (
      (deal.stage === OpportunityStage.ClosedWon || deal.stage === OpportunityStage.ClosedLost) &&
      deal.actualCloseDate !== null &&
      deal.estimatedValue > 0
    );
  }

  private calculateSimilarityScore(
    newOpportunity: CreateSimilarOpportunityDto,
    historicalDeal: OpportunityDto
  ): number {
    let totalScore = 0;

    // Value similarity (30% weight)
    totalScore += this.calculateValueSimilarity(newOpportunity, historicalDeal) * this.WEIGHTS.value;

    // Client similarity (25% weight)
    totalScore += this.calculateClientSimilarity(newOpportunity, historicalDeal) * this.WEIGHTS.client;

    // Source similarity (15% weight)
    totalScore += this.calculateSourceSimilarity(newOpportunity, historicalDeal) * this.WEIGHTS.source;

    // Description similarity (15% weight)
    totalScore += this.calculateDescriptionSimilarity(newOpportunity, historicalDeal) * this.WEIGHTS.description;

    // Stage progression similarity (10% weight)
    totalScore += this.calculateStageSimilarity(newOpportunity, historicalDeal) * this.WEIGHTS.stage;

    // Time frame similarity (5% weight)
    totalScore += this.calculateTimeFrameSimilarity(newOpportunity, historicalDeal) * this.WEIGHTS.timeFrame;

    return totalScore;
  }

  private calculateValueSimilarity(
    newOpportunity: CreateSimilarOpportunityDto,
    historicalDeal: OpportunityDto
  ): number {
    if (!newOpportunity.estimatedValue || !historicalDeal.estimatedValue) return 0;

    const valueDiff = Math.abs(newOpportunity.estimatedValue - historicalDeal.estimatedValue);
    const maxValue = Math.max(newOpportunity.estimatedValue, historicalDeal.estimatedValue);
    const valueSimilarity = 1 - (valueDiff / maxValue);

    // Apply exponential decay for larger differences
    return Math.max(0, Math.pow(valueSimilarity, 2));
  }

  private calculateClientSimilarity(
    newOpportunity: CreateSimilarOpportunityDto,
    historicalDeal: OpportunityDto
  ): number {
    if (newOpportunity.clientId === historicalDeal.clientId) return 1.0;
    if (!newOpportunity.clientName || !historicalDeal.clientName) return 0;

    return this.calculateStringSimilarity(newOpportunity.clientName, historicalDeal.clientName);
  }

  private calculateSourceSimilarity(
    newOpportunity: CreateSimilarOpportunityDto,
    historicalDeal: OpportunityDto
  ): number {
    return newOpportunity.source === historicalDeal.source ? 1.0 : 0.0;
  }

  private calculateDescriptionSimilarity(
    newOpportunity: CreateSimilarOpportunityDto,
    historicalDeal: OpportunityDto
  ): number {
    if (!newOpportunity.description || !historicalDeal.description) return 0;

    const desc1 = newOpportunity.description.toLowerCase();
    const desc2 = historicalDeal.description.toLowerCase();

    // Simple keyword overlap calculation
    const words1 = desc1.split(/\s+/).filter(word => word.length > 3);
    const words2 = desc2.split(/\s+/).filter(word => word.length > 3);

    const commonWords = words1.filter(word => words2.includes(word));
    const totalUniqueWords = new Set([...words1, ...words2]).size;

    return totalUniqueWords > 0 ? commonWords.length / totalUniqueWords : 0;
  }

  private calculateStageSimilarity(
    newOpportunity: CreateSimilarOpportunityDto,
    historicalDeal: OpportunityDto
  ): number {
    // For new opportunities, we assume they start at Lead stage
    // Historical deals that progressed through similar stages get higher scores
    const currentStage = OpportunityStage.Lead;
    const historicalStage = historicalDeal.stage;

    if (currentStage === historicalStage) return 1.0;
    if (historicalStage === OpportunityStage.ClosedWon || historicalStage === OpportunityStage.ClosedLost) {
      return 0.8; // Closed deals are still relevant for learning
    }

    return 0.5; // Other stages have moderate similarity
  }

  private calculateTimeFrameSimilarity(
    newOpportunity: CreateSimilarOpportunityDto,
    historicalDeal: OpportunityDto
  ): number {
    if (!newOpportunity.expectedCloseDate || !historicalDeal.expectedCloseDate) return 0;

    const newDate = new Date(newOpportunity.expectedCloseDate);
    const historicalDate = new Date(historicalDeal.expectedCloseDate);
    const diffDays = Math.abs((newDate.getTime() - historicalDate.getTime()) / (1000 * 60 * 60 * 24));

    // Consider deals within 90 days as similar timeframes
    if (diffDays <= 90) return 1.0;
    if (diffDays <= 180) return 0.5;
    return 0.0;
  }

  private calculateStringSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase().trim();
    const s2 = str2.toLowerCase().trim();

    if (s1 === s2) return 1.0;
    if (s1.includes(s2) || s2.includes(s1)) return 0.8;

    // Simple character overlap calculation
    const chars1 = new Set(s1.replace(/\s/g, ''));
    const chars2 = new Set(s2.replace(/\s/g, ''));
    const commonChars = [...chars1].filter(char => chars2.has(char));
    const totalChars = new Set([...chars1, ...chars2]).size;

    return totalChars > 0 ? commonChars.length / totalChars : 0;
  }

  private calculateDaysToClose(deal: OpportunityDto): number | null {
    if (!deal.actualCloseDate || !deal.createdAt) return null;

    const closeDate = new Date(deal.actualCloseDate);
    const createDate = new Date(deal.createdAt);
    const diffTime = closeDate.getTime() - createDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private extractSuccessFactors(deal: OpportunityDto): string[] {
    const factors: string[] = [];

    if (deal.probability >= 80) {
      factors.push("High probability assessment");
    }

    if (deal.stage === OpportunityStage.ClosedWon) {
      factors.push("Successfully closed");
    }

    const daysToClose = this.calculateDaysToClose(deal);
    if (daysToClose !== null && daysToClose < 90) {
      factors.push("Quick close time");
    }

    if (deal.description && deal.description.toLowerCase().includes("reference")) {
      factors.push("Customer reference available");
    }

    return factors;
  }

  private extractRiskFactors(deal: OpportunityDto): string[] {
    const factors: string[] = [];

    if (deal.probability <= 30) {
      factors.push("Low probability assessment");
    }

    if (deal.stage === OpportunityStage.ClosedLost) {
      factors.push("Deal was lost");
    }

    const daysToClose = this.calculateDaysToClose(deal);
    if (daysToClose !== null && daysToClose > 180) {
      factors.push("Extended sales cycle");
    }

    if (deal.lossReason) {
      factors.push(`Loss reason: ${deal.lossReason}`);
    }

    return factors;
  }
}

export const dealSimilarityEngine = new DealSimilarityEngineImpl();