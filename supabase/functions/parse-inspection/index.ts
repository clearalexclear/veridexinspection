import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { fileContent, fileName } = await req.json();
    
    if (!fileContent) {
      return new Response(JSON.stringify({ error: "No file content provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Truncate content to avoid exceeding AI context limits
    const maxChars = 600_000;
    const trimmedContent = fileContent.length > maxChars 
      ? fileContent.slice(0, maxChars) + "\n\n[Content truncated due to length]"
      : fileContent;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert inspection report parser. Extract structured data from raw inspection reports (PDF text or Word document text). 

Return a JSON object with these exact fields. Use realistic values based on what you find. If a field cannot be determined, use sensible defaults.

{
  "productName": "string",
  "supplierName": "string",
  "factoryName": "string",
  "factoryAddress": "string",
  "inspectionDate": "YYYY-MM-DD",
  "poNumber": "string",
  "orderQuantity": number,
  "inspectedQuantity": number,
  "destinationCountry": "string",
  "inspectorName": "string",
  "inspectionType": "string",
  "productCategory": "string",
  "skuModel": "string",
  "overallResult": "APPROVED" | "APPROVED WITH RESERVATIONS" | "REJECTED",
  "qualityScore": number (0-100),
  "riskLevel": "low" | "medium" | "high",
  "decision": "ship" | "ship-with-corrections" | "do-not-ship",
  "confidenceScore": number (0-100),
  "recommendation": "string (2-3 sentences)",
  "quickSummary": "string (1 sentence)",
  "businessImpact": "string (1-2 sentences about business risk)",
  "inspectorComments": "string (paragraph)",
  "defects": [
    {
      "title": "string",
      "severity": "critical" | "major" | "minor",
      "description": "string",
      "quantityAffected": number,
      "percentAffected": number,
      "recommendedAction": "string",
      "impactDescription": "string",
      "businessImpact": {
        "customerExperience": "low" | "medium" | "high",
        "compliance": "low" | "medium" | "high",
        "returnRefund": "low" | "medium" | "high"
      }
    }
  ],
  "keyIssues": [
    {
      "title": "string",
      "severity": "critical" | "major" | "minor",
      "percentAffected": number,
      "impactDescription": "string"
    }
  ],
  "actionPlan": [
    {
      "issue": "string",
      "action": "string",
      "estimatedDays": "string",
      "priority": "low" | "medium" | "high"
    }
  ],
  "aql": {
    "inspectionLevel": "string",
    "sampleSizeCode": "string",
    "sampleSize": number,
    "critical": { "accept": number, "found": number },
    "major": { "accept": number, "found": number },
    "minor": { "accept": number, "found": number },
    "result": "pass" | "fail"
  },
  "tests": [
    {
      "name": "string",
      "unitsTested": number,
      "passed": number,
      "failed": number,
      "notes": "string",
      "status": "pass" | "fail" | "warning"
    }
  ],
  "measurements": [
    {
      "parameter": "string",
      "spec": "string",
      "actual": "string",
      "tolerance": "string",
      "status": "pass" | "fail" | "warning"
    }
  ],
  "conformity": [
    {
      "name": "string",
      "status": "pass" | "fail" | "warning",
      "note": "string"
    }
  ],
  "packagingChecklist": [
    {
      "name": "string",
      "status": "pass" | "fail" | "warning",
      "notes": "string"
    }
  ],
  "supplierScore": {
    "overall": number (0-10),
    "qualityConsistency": number (0-10),
    "packagingAccuracy": number (0-10),
    "defectRate": number (0-10),
    "professionalism": number (0-10),
    "insight": "string"
  },
  "timeToFix": [
    { "task": "string", "estimatedDays": "string" }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Parse this inspection report and extract all structured data. File name: ${fileName}\n\nContent:\n${trimmedContent}` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_inspection_data",
              description: "Extract structured inspection report data",
              parameters: {
                type: "object",
                properties: {
                  productName: { type: "string" },
                  supplierName: { type: "string" },
                  factoryName: { type: "string" },
                  factoryAddress: { type: "string" },
                  inspectionDate: { type: "string" },
                  poNumber: { type: "string" },
                  orderQuantity: { type: "number" },
                  inspectedQuantity: { type: "number" },
                  destinationCountry: { type: "string" },
                  inspectorName: { type: "string" },
                  inspectionType: { type: "string" },
                  productCategory: { type: "string" },
                  skuModel: { type: "string" },
                  overallResult: { type: "string", enum: ["APPROVED", "APPROVED WITH RESERVATIONS", "REJECTED"] },
                  qualityScore: { type: "number" },
                  riskLevel: { type: "string", enum: ["low", "medium", "high"] },
                  decision: { type: "string", enum: ["ship", "ship-with-corrections", "do-not-ship"] },
                  confidenceScore: { type: "number" },
                  recommendation: { type: "string" },
                  quickSummary: { type: "string" },
                  businessImpact: { type: "string" },
                  inspectorComments: { type: "string" },
                  defects: { type: "array", items: { type: "object", properties: { title: { type: "string" }, severity: { type: "string" }, description: { type: "string" }, quantityAffected: { type: "number" }, percentAffected: { type: "number" }, recommendedAction: { type: "string" }, impactDescription: { type: "string" }, businessImpact: { type: "object", properties: { customerExperience: { type: "string" }, compliance: { type: "string" }, returnRefund: { type: "string" } } } } } },
                  keyIssues: { type: "array", items: { type: "object", properties: { title: { type: "string" }, severity: { type: "string" }, percentAffected: { type: "number" }, impactDescription: { type: "string" } } } },
                  actionPlan: { type: "array", items: { type: "object", properties: { issue: { type: "string" }, action: { type: "string" }, estimatedDays: { type: "string" }, priority: { type: "string" } } } },
                  aql: { type: "object", properties: { inspectionLevel: { type: "string" }, sampleSizeCode: { type: "string" }, sampleSize: { type: "number" }, critical: { type: "object" }, major: { type: "object" }, minor: { type: "object" }, result: { type: "string" } } },
                  tests: { type: "array", items: { type: "object" } },
                  measurements: { type: "array", items: { type: "object" } },
                  conformity: { type: "array", items: { type: "object" } },
                  packagingChecklist: { type: "array", items: { type: "object" } },
                  supplierScore: { type: "object" },
                  timeToFix: { type: "array", items: { type: "object" } },
                },
                required: ["productName", "supplierName", "overallResult", "qualityScore", "decision", "defects"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "extract_inspection_data" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error("AI parsing failed");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall?.function?.arguments) {
      throw new Error("AI did not return structured data");
    }

    const parsedData = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(parsedData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("parse-inspection error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
