import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const defaultConfidence = {
  inspectionDate: "low",
  inspectorName: "low",
  orderQuantity: "low",
  shipmentQuantity: "low",
  qtyReadyForInspection: "low",
  inspectedQuantity: "low",
  overallResult: "low",
  supplierName: "low",
  manufacturer: "low",
  productName: "low",
};

function parseNestedJson(raw: string) {
  try {
    return JSON.parse(raw);
  } catch {
    const cleaned = raw
      .replace(/^```json\s*/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();
    return JSON.parse(cleaned);
  }
}

function normalizeOverallResult(value: unknown) {
  const v = String(value || "").toUpperCase();
  if (v.includes("RESERV")) return "APPROVED WITH RESERVATIONS";
  if (v.includes("REJECT") || v.includes("FAIL")) return "REJECTED";
  if (v.includes("APPROV")) return "APPROVED";
  return "APPROVED WITH RESERVATIONS";
}

// Removed: normalizeDecision — no longer needed (fact-based system)

// Removed: normalizeRisk — no longer needed (fact-based system)

function normalizeParsedData(raw: Record<string, any>) {
  return {
    productName: raw.productName ?? "",
    supplierName: raw.supplierName ?? "",
    manufacturer: raw.manufacturer ?? "",
    factoryName: raw.factoryName ?? "",
    factoryAddress: raw.factoryAddress ?? "",
    inspectionDate: raw.inspectionDate ?? "",
    poNumber: raw.poNumber ?? "",
    orderQuantity: Number(raw.orderQuantity ?? 0),
    shipmentQuantity: Number(raw.shipmentQuantity ?? 0),
    qtyReadyForInspection: Number(raw.qtyReadyForInspection ?? 0),
    inspectedQuantity: Number(raw.inspectedQuantity ?? 0),
    destinationCountry: raw.destinationCountry ?? "",
    inspectorName: raw.inspectorName ?? "",
    inspectionType: raw.inspectionType ?? "",
    productCategory: raw.productCategory ?? "",
    skuModel: raw.skuModel ?? "",
    clientName: raw.clientName ?? "",
    overallResult: normalizeOverallResult(raw.overallResult),
    qualityScore: Number(raw.qualityScore ?? 70),
    riskLevel: normalizeRisk(raw.riskLevel),
    decision: normalizeDecision(raw.decision),
    confidenceScore: Number(raw.confidenceScore ?? 70),
    recommendation: raw.recommendation ?? "",
    quickSummary: raw.quickSummary ?? "",
    businessImpact: raw.businessImpact ?? "",
    inspectorComments: raw.inspectorComments ?? "",
    fieldConfidence: {
      ...defaultConfidence,
      ...(raw.fieldConfidence || {}),
    },
    defects: Array.isArray(raw.defects) ? raw.defects : [],
    keyIssues: Array.isArray(raw.keyIssues) ? raw.keyIssues : [],
    actionPlan: Array.isArray(raw.actionPlan) ? raw.actionPlan : [],
    remarks: Array.isArray(raw.remarks) ? raw.remarks : [],
    quantityBreakdown: Array.isArray(raw.quantityBreakdown) ? raw.quantityBreakdown : [],
    aql: raw.aql ?? {},
    tests: Array.isArray(raw.tests) ? raw.tests : [],
    measurements: Array.isArray(raw.measurements) ? raw.measurements : [],
    conformity: Array.isArray(raw.conformity) ? raw.conformity : [],
    packagingChecklist: Array.isArray(raw.packagingChecklist) ? raw.packagingChecklist : [],
    supplierScore: raw.supplierScore ?? {},
    timeToFix: Array.isArray(raw.timeToFix) ? raw.timeToFix : [],
    images: Array.isArray(raw.images) ? raw.images : [],
  };
}

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

    const systemPrompt = `You are an expert inspection report parser for quality control reports.

Extract structured data from this inspection report.

CRITICAL MAPPING RULES:
- Keep these quantities distinct:
  1) orderQuantity = total ordered quantity
  2) shipmentQuantity = planned/actual shipment quantity
  3) qtyReadyForInspection = quantity ready at factory during inspection
  4) inspectedQuantity = quantity sampled/inspected
- Keep these entities distinct:
  - supplierName (vendor)
  - manufacturer (factory/manufacturer company)
  - inspectorName (person who performed inspection)
  - inspectionDate (actual inspection date)

For key fields, include confidence levels in fieldConfidence using only "high", "medium", or "low".

Return your full extraction as a JSON STRING in the function argument "result".
The JSON should include keys used by the review UI:
productName, supplierName, manufacturer, factoryName, factoryAddress, inspectionDate, poNumber,
orderQuantity, shipmentQuantity, qtyReadyForInspection, inspectedQuantity,
destinationCountry, inspectorName, inspectionType, productCategory, skuModel, clientName,
overallResult, qualityScore, riskLevel, decision, confidenceScore,
recommendation, quickSummary, businessImpact, inspectorComments,
fieldConfidence, defects, keyIssues, actionPlan, remarks, quantityBreakdown,
aql, tests, measurements, conformity, packagingChecklist, supplierScore, timeToFix, images.`;

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
          {
            role: "user",
            content: `Parse this inspection report and extract structured data. File name: ${fileName}\n\nContent:\n${trimmedContent}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "extract_inspection_data",
              description: "Return extracted inspection data as JSON string",
              parameters: {
                type: "object",
                properties: {
                  result: {
                    type: "string",
                    description: "A JSON string containing all extracted fields",
                  },
                },
                required: ["result"],
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
    const rawArguments = toolCall?.function?.arguments;

    if (!rawArguments) {
      throw new Error("AI did not return structured data");
    }

    const outerArgs = JSON.parse(rawArguments);
    if (!outerArgs?.result || typeof outerArgs.result !== "string") {
      throw new Error("AI returned invalid extraction payload");
    }

    const parsedData = normalizeParsedData(parseNestedJson(outerArgs.result));

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
