import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function generateAiInsights(data: any) {
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });

  const prompt = `
    You are a financial advisor AI inside an expense tracking app.
    Please analyze the following user transaction data and provide a brief, encouraging, and actionable financial insight report.
    Keep it concise (3-4 short paragraphs). Use markdown formatting (## for headers, ** for bold, - for lists).

    Data:
    Total Income: ₹${data.totalIncome}
    Total Expenses: ₹${data.totalExpenses}
    Expenses By Category: ${JSON.stringify(data.expensesByCategory)}
    Recent Transactions: ${JSON.stringify(data.recentTransactions)}

    Provide:
    1. A quick summary of their spending vs income.
    2. Identification of the highest spending category.
    3. One practical tip to save money based on their recent transactions.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return "## AI Insight Currently Unavailable\n\nWe're currently experiencing high demand for AI insights. Please check back later to view your personalized financial report. Keep tracking those expenses! 🚀";
  }
}
