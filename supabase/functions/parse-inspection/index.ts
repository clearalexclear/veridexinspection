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

    const maxChars = 600_000;
    const trimmedContent = fileContent.length > maxChars
      ? fileContent.slice(0, maxChars) + "\n\n[Content truncated due to length]"
      : fileContent;

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert inspection report parser for a quality control company. Extract structured data from raw inspection reports.

CRITICAL RULES:
- Treat these as DISTINCT fields — never merge or confuse them:
  - "orderQuantity" = total quantity ordered by client
  - "shipmentQuantity" = quantity being shipped this time
  - "qtyReadyForInspection" = quantity available at factory when inspector arrived
  - "inspectedQuantity" = quantity actually inspected/sampled
- Extract "inspectorName" carefully — it is the person who performed the inspection, NOT the client or supplier contact.
- Extract "inspectionDate" as the actual date the inspection took place, not the report date.
- "overallResult" must be one of: APPROVED, APPROVED WITH RESERVATIONS, REJECTED.

For each key field, also provide a confidence level ("high", "medium", or "low") indicating how certain you are the extraction is correct.

Return a JSON object with these fields. If a field cannot be determined, use null and set confidence to "low".`;

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
              description: "Extract structured inspection report data with confidence levels",
              parameters: {
                type: "object",
                properties: {
                  productName: { type: "string" },
                  supplierName: { type: "string" },
                  manufacturer: { type: "string" },
                  factoryName: { type: "string" },
                  factoryAddress: { type: "string" },
                  inspectionDate: { type: "string", description: "YYYY-MM-DD format" },
                  poNumber: { type: "string" },
                  orderQuantity: { type: "number", description: "Total quantity ordered" },
                  shipmentQuantity: { type: "number", description: "Quantity being shipped" },
                  qtyReadyForInspection: { type: "number", description: "Quantity available at factory during inspection" },
                  inspectedQuantity: { type: "number", description: "Quantity actually inspected/sampled" },
                  destinationCountry: { type: "string" },
                  inspectorName: { type: "string", description: "Name of the person who performed the inspection" },
                  inspectionType: { type: "string" },
                  productCategory: { type: "string" },
                  skuModel: { type: "string" },
                  clientName: { type: "string" },
                  overallResult: { type: "string", enum: ["APPROVED", "APPROVED WITH RESERVATIONS", "REJECTED"] },
                  qualityScore: { type: "number" },
                  riskLevel: { type: "string", enum: ["low", "medium", "high"] },
                  decision: { type: "string", enum: ["ship", "ship-with-corrections", "do-not-ship"] },
                  confidenceScore: { type: "number" },
                  recommendation: { type: "string" },
                  quickSummary: { type: "string" },
                  businessImpact: { type: "string" },
                  inspectorComments: { type: "string" },
                  fieldConfidence: {
                    type: "object",
                    description: "Confidence level for each key field",
                    properties: {
                      inspectionDate: { type: "string", enum: ["high", "medium", "low"] },
                      inspectorName: { type: "string", enum: ["high", "medium", "low"] },
                      orderQuantity: { type: "string", enum: ["high", "medium", "low"] },
                      shipmentQuantity: { type: "string", enum: ["high", "medium", "low"] },
                      qtyReadyForInspection: { type: "string", enum: ["high", "medium", "low"] },
                      inspectedQuantity: { type: "string", enum: ["high", "medium", "low"] },
                      overallResult: { type: "string", enum: ["high", "medium", "low"] },
                      supplierName: { type: "string", enum: ["high", "medium", "low"] },
                      manufacturer: { type: "string", enum: ["high", "medium", "low"] },
                      productName: { type: "string", enum: ["high", "medium", "low"] },
                    },
                  },
                  defects: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        title: { type: "string" },
                        severity: { type: "string", enum: ["critical", "major", "minor"] },
                        description: { type: "string" },
                        quantityAffected: { type: "number" },
                        percentAffected: { type: "number" },
                        recommendedAction: { type: "string" },
                        impactDescription: { type: "string" },
                        businessImpact: {
                          type: "object",
                          properties: {
                            customerExperience: { type: "string" },
                            compliance: { type: "string" },
                            returnRefund: { type: "string" },
                          },
                        },
                      },
                    },
                  },
                  keyIssues: { type: "array", items: { type: "object", properties: { title: { type: "string" }, severity: { type: "string" }, percentAffected: { type: "number" }, impactDescription: { type: "string" } } } },
                  actionPlan: { type: "array", items: { type: "object", properties: { issue: { type: "string" }, action: { type: "string" }, estimatedDays: { type: "string" }, priority: { type: "string" } } } },
                  remarks: {
                    type: "array",
                    description: "Each remark or pending/failure reason as a separate item",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        category: { type: "string", enum: ["remark", "pending", "failure"] },
                      },
                    },
                  },
                  quantityBreakdown: {
                    type: "array",
                    description: "Breakdown of quantities by variant/SKU",
                    items: {
                      type: "object",
                      properties: {
                        variant: { type: "string" },
                        ordered: { type: "number" },
                        packed: { type: "number" },
                        inspected: { type: "number" },
                      },
                    },
                  },
                  aql: { type: "object", properties: { inspectionLevel: { type: "string" }, sampleSizeCode: { type: "string" }, sampleSize: { type: "number" }, critical: { type: "object" }, major: { type: "object" }, minor: { type: "object" }, result: { type: "string" }, quantityCheckResult: { type: "string" }, productSpecResult: { type: "string" }, packagingResult: { type: "string" }, testMeasurementResult: { type: "string" } } },
                  tests: { type: "array", items: { type: "object", properties: { name: { type: "string" }, description: { type: "string" }, unitsTested: { type: "number" }, passed: { type: "number" }, failed: { type: "number" }, notes: { type: "string" }, status: { type: "string" } } } },
                  measurements: { type: "array", items: { type: "object", properties: { parameter: { type: "string" }, spec: { type: "string" }, actual: { type: "string" }, tolerance: { type: "string" }, status: { type: "string" } } } },
                  conformity: { type: "array", items: { type: "object", properties: { name: { type: "string" }, status: { type: "string" }, note: { type: "string" } } } },
                  packagingChecklist: { type: "array", items: { type: "object", properties: { name: { type: "string" }, status: { type: "string" }, notes: { type: "string" } } } },
                  supplierScore: { type: "object", properties: { overall: { type: "number" }, qualityConsistency: { type: "number" }, packagingAccuracy: { type: "number" }, defectRate: { type: "number" }, professionalism: { type: "number" }, insight: { type: "string" } } },
                  timeToFix: { type: "array", items: { type: "object", properties: { task: { type: "string" }, estimatedDays: { type: "string" } } } },
                },
                required: ["productName", "overallResult", "defects", "fieldConfidence"],
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
