import { NextRequest, NextResponse } from "next/server";
import { getAxiosInstance } from "@/utils/axiosInstance";
import { dealSimilarityEngine } from "@/utils/dealSimilarityEngine";
import { CreateSimilarOpportunityDto } from "@/utils/dealSimilarityEngine";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newOpportunity: CreateSimilarOpportunityDto = body;

    // Fetch historical deals from the API
    const instance = getAxiosInstance();
    const response = await instance.get("/Opportunities", {
      params: {
        pageSize: 1000, // Get all historical deals
        isActive: false // Only get closed deals
      }
    });

    const historicalDeals = response.data.items || [];
    const similarDeals = dealSimilarityEngine.findSimilarDeals(newOpportunity, historicalDeals);

    return NextResponse.json({
      success: true,
      data: similarDeals
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to find similar deals"
    }, { status: 500 });
  }
}
