

import { GoogleGenAI, Type } from "@google/genai";
import { CrewMember, Document, ComplianceIssue, PlannerRequest, CrewSuggestion, Rank, Appraisal, AIHRAssistantAction } from "../types";

// This is a mock implementation. In a real app, the API key would be
// securely stored in environment variables.
const API_KEY = process.env.API_KEY;

// A guard to ensure the app can run in environments without an API key,
// by returning a mocked response.
if (!API_KEY) {
    console.warn("API_KEY environment variable not found. Using mocked Gemini service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

/**
 * Simulates an AI-powered natural language search on crew data.
 * In a real implementation, this would make a call to the Gemini API.
 * For now, it returns a descriptive string of what it would do.
 * 
 * @param query The natural language query from the user.
 * @param crewData The full list of crew members to search through.
 * @returns A string describing the action that would be taken.
 */
export const handleAISmartSearch = async (query: string, crewData: CrewMember[]): Promise<string> => {
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!ai) {
        return `(Mocked Response) AI Smart Search is disabled because the API key is not configured.
If it were enabled, I would have processed the query: "${query}".
I would analyze the query to extract key intents like rank, nationality, and status. 
Then, I would filter the provided crew data based on these criteria and return a summary of the matching crew members.`;
    }

    try {
        const prompt = `
You are an AI assistant for a Crew Management System. Your task is to act as a smart search engine.
Analyze the user's query and the provided JSON data of crew members.
Based on the query, identify the crew members that match the criteria.
Respond with a concise summary of your findings. Do not return JSON. Just provide a natural language summary.

For example, if the query is "show me all captains", you should respond with "I found X captains: [List of names]".
If the query is complex like "any chief engineers from the Philippines who are on standby", respond with a clear summary of your findings.

User Query: "${query}"

Crew Data (JSON):
${JSON.stringify(crewData, null, 2)}
`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                // Disable thinking for faster response for this search-like task
                thinkingConfig: { thinkingBudget: 0 }
            }
        });

        return response.text;

    } catch (error) {
        console.error("Gemini API call failed:", error);
        return "There was an error communicating with the AI. Please check the console for details.";
    }
};


/**
 * Analyzes crew and document data for compliance issues using the Gemini API.
 * @param crewData The full list of crew members.
 * @param documentsData The full list of all documents.
 * @returns A promise that resolves to an array of compliance issues.
 */
export const handleComplianceAnalysis = async (crewData: CrewMember[], documentsData: Document[]): Promise<ComplianceIssue[]> => {
    
     if (!ai) {
        // Simulate network delay and return mock data if API key is not set
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log("Returning mocked compliance data.");
        return [
            {
                crewMemberName: "Bob Johnson",
                crewMemberId: "C-Mock1",
                issueType: "Expired Document",
                documentType: "Medical Certificate",
                expiryDate: "2024-01-15",
                details: "Medical certificate expired on 2024-01-15. This is a critical issue."
            },
            {
                crewMemberName: "Jane Smith",
                crewMemberId: "C002",
                issueType: "Missing Document",
                documentType: "Passport",
                details: "Chief Engineers require a valid Passport, but none was found for this crew member."
            }
        ];
    }
    
    const complianceSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            crewMemberName: { type: Type.STRING },
            crewMemberId: { type: Type.STRING },
            issueType: { type: Type.STRING, enum: ['Expired Document', 'Missing Document'] },
            documentType: { type: Type.STRING },
            details: { type: Type.STRING },
            expiryDate: { type: Type.STRING, description: "The expiry date of the document, if applicable. Format: YYYY-MM-DD" }
          },
          required: ["crewMemberName", "crewMemberId", "issueType", "documentType", "details"]
        }
    };
    
    // Combine crew data with their documents for a comprehensive prompt
    const enrichedCrewData = crewData.map(crew => ({
        ...crew,
        documents: documentsData.filter(doc => crew.documents.some(d => d.id === doc.id))
    }));

    const prompt = `
You are an expert maritime compliance officer. Your task is to analyze the provided JSON data of crew members and their documents to identify any compliance issues. Today's date is ${new Date().toISOString().split('T')[0]}.

Here are the compliance rules:
1.  **Expired Documents**: A document is expired if its 'expiryDate' is before today's date.
2.  **Missing Mandatory Documents**: Certain ranks have mandatory document requirements.
    -   **Captain**: Must have a 'Passport' and a 'Medical Certificate'.
    -   **Chief Engineer**: Must have a 'Passport' and a 'Medical Certificate'.
    -   **All other ranks**: Must have a 'Passport'.

Analyze the data below and identify all crew members who violate these rules. For each violation, create an issue object.

Crew & Document Data (JSON):
${JSON.stringify(enrichedCrewData, null, 2)}
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: complianceSchema,
            },
        });

        const jsonText = response.text.trim();
        // The response text is expected to be a valid JSON array string
        return JSON.parse(jsonText) as ComplianceIssue[];

    } catch (error) {
        console.error("Gemini API call for compliance failed:", error);
        throw new Error("Failed to analyze compliance data with AI. Please check the console for details.");
    }
};

/**
 * Summarizes a surveyor's finding description using the Gemini API.
 * @param description The detailed description of the finding.
 * @returns A promise that resolves to a concise summary string.
 */
export const handleSummarizeFinding = async (description: string): Promise<string> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `(Mocked AI Summary) This is a summary of the finding: "${description.substring(0, 50)}..."`;
    }

    const prompt = `
You are an AI assistant for a maritime company. Your task is to summarize a surveyor's finding into a single, concise sentence suitable for a high-level report.
Focus on the core issue and the recommended action or observation.

Finding Description:
"${description}"

Generate a one-sentence summary.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.2, // Lower temperature for more factual summaries
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call for summarization failed:", error);
        return "Could not generate AI summary due to an error.";
    }
};

/**
 * Generates a crew plan based on requirements and available crew.
 * @param request The crewing requirements.
 * @param availableCrew The list of crew members with status 'standby'.
 * @returns A promise that resolves to an array of crew suggestions.
 */
export const handleCrewPlanning = async (request: PlannerRequest, availableCrew: CrewMember[]): Promise<CrewSuggestion[]> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return [
            {
                crewMemberId: "C008",
                crewMemberName: "Juan Dela Cruz",
                rank: Rank.Captain,
                reasoning: "(Mocked Response) Selected because this is the only available Captain."
            },
            {
                crewMemberId: "C009",
                crewMemberName: "David Miller",
                rank: Rank.Bosun,
                reasoning: "(Mocked Response) Good fit for the Bosun position based on availability."
            }
        ];
    }
    
    const suggestionSchema = {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            crewMemberName: { type: Type.STRING },
            crewMemberId: { type: Type.STRING },
            rank: { type: Type.STRING, enum: Object.values(Rank) },
            reasoning: { type: Type.STRING, description: "A brief, one-sentence explanation for why this crew member was chosen." }
          },
          required: ["crewMemberName", "crewMemberId", "rank", "reasoning"]
        }
    };
    
    const prompt = `
You are an expert AI Crew Planner for a maritime company. Your task is to analyze the user's crewing request and the list of available crew members to propose the best-fit candidates for each position.

**Your Goal:** Fulfill the requested ranks and quantities from the list of available crew.

**User's Request:**
${JSON.stringify(request.ranks, null, 2)}

**Available Crew Members (JSON):**
${JSON.stringify(availableCrew, null, 2)}

**Instructions:**
1.  For each requested rank, find the best available crew member from the list.
2.  Prioritize crew members whose rank exactly matches the request.
3.  If multiple crew members match a rank, you can make a reasonable choice (e.g., based on the order provided).
4.  Do not suggest more crew than the quantity requested for each rank.
5.  For each suggestion, provide a concise, one-sentence reasoning for your choice. For example: "Best available candidate for the Captain position." or "Fulfills the requirement for an Oiler."

Generate a JSON array of your suggestions based on the provided schema.
`;
    
     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: suggestionSchema,
            },
        });

        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CrewSuggestion[];

    } catch (error) {
        console.error("Gemini API call for crew planning failed:", error);
        throw new Error("Failed to generate crew plan with AI. Please check the console for details.");
    }
};

/**
 * Generates HR-related text content for a specific crew member.
 * @param crewMember The crew member to generate content for.
 * @param appraisals A list of the crew member's appraisals.
 * @param action The type of content to generate.
 * @returns A promise that resolves to the generated text string.
 */
export const handleAIHRAssistant = async (
    crewMember: CrewMember,
    appraisals: Appraisal[],
    action: AIHRAssistantAction
): Promise<string> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return `(Mocked AI Response) AI HR Assistant is disabled. If enabled, I would perform the '${action}' action for ${crewMember.name}.`;
    }

    let prompt = `You are an expert AI HR Assistant for a maritime company. Your task is to generate professional HR documents for a seafarer.
Today's date is ${new Date().toLocaleDateString()}. The company is "CMS Pro, Inc.".

Here is the data for the seafarer:
${JSON.stringify(crewMember, null, 2)}

Here are their performance appraisals:
${JSON.stringify(appraisals, null, 2)}
`;

    switch (action) {
        case 'summarize':
            prompt += `
Based on all the provided data, please write a concise, professional summary of this seafarer's career history and performance. 
Focus on their key strengths as highlighted in the appraisals. The summary should be suitable for an internal personnel file.
`;
            break;
        case 'recommendation':
            prompt += `
Based on all the provided data, please write a formal, positive Letter of Recommendation for this seafarer.
The letter should be from "Admin User, Crewing Manager, CMS Pro, Inc.".
Highlight their skills, performance, and teamwork as noted in their appraisals.
The letter should be well-structured and professional.
`;
            break;
        case 'verification':
            prompt += `
Based on the provided data, please write a formal Employment Verification Letter for this seafarer.
The letter should confirm their employment with "CMS Pro, Inc.", their current rank, and their status.
Assume their employment started on a plausible date (e.g., a few years before their first appraisal if available, otherwise 3 years ago).
The letter should be addressed "To Whom It May Concern" and be from "HR Department, CMS Pro, Inc.".
`;
            break;
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.5, // A bit of creativity for writing letters
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API call for HR assistant failed:", error);
        return "Could not generate content due to an AI service error.";
    }
};
