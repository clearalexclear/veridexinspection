import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function parseNestedJson(raw: string) {
  // Strip markdown fences
  let cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```/i, "")
    .replace(/```$/i, "")
    .trim();

  // Find JSON boundaries
  const jsonStart = cleaned.search(/[\{\[]/);
  const jsonEnd = cleaned.lastIndexOf(jsonStart !== -1 && cleaned[jsonStart] === '[' ? ']' : '}');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    // Remove control characters and fix trailing commas
    cleaned = cleaned
      .replace(/[\x00-\x1F\x7F]/g, "")
      .replace(/,\s*}/g, "}")
      .replace(/,\s*]/g, "]");
    return JSON.parse(cleaned);
  }
}

function normalizeParsedData(raw: Record<string, any>) {
  const fc = raw.fieldConfidence || {};
  const conf = (key: string, value: any) => {
    if (value === null || value === undefined || value === "" || value === 0) return "low";
    return fc[key] || "medium";
  };

  const result: Record<string, any> = {
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
    packedQuantity: Number(raw.packedQuantity ?? raw.shipmentQuantity ?? 0),
    destinationCountry: raw.destinationCountry ?? "",
    inspectorName: raw.inspectorName ?? "",
    inspectionType: raw.inspectionType ?? "",
    productCategory: raw.productCategory ?? "",
    skuModel: raw.skuModel ?? "",
    clientName: raw.clientName ?? "",
    inspectorComments: raw.inspectorComments ?? "",
    defects: Array.isArray(raw.defects) ? raw.defects : [],
    remarks: Array.isArray(raw.remarks) ? raw.remarks : [],
    quantityBreakdown: Array.isArray(raw.quantityBreakdown) ? raw.quantityBreakdown : [],
    aql: raw.aql ?? {},
    tests: Array.isArray(raw.tests) ? raw.tests : [],
    measurements: Array.isArray(raw.measurements) ? raw.measurements : [],
    conformity: Array.isArray(raw.conformity) ? raw.conformity : [],
    packagingChecklist: Array.isArray(raw.packagingChecklist) ? raw.packagingChecklist : [],
    images: Array.isArray(raw.images) ? raw.images.map((img: any) => ({
      url: img.url || img.src || "",
      caption: img.caption || img.description || "",
      category: img.category || "uncategorized",
      reference: img.reference || img.pageNumber || "",
    })) : [],
  };

  result.fieldConfidence = {
    productName: conf("productName", result.productName),
    supplierName: conf("supplierName", result.supplierName),
    manufacturer: conf("manufacturer", result.manufacturer),
    inspectionDate: conf("inspectionDate", result.inspectionDate),
    inspectorName: conf("inspectorName", result.inspectorName),
    orderQuantity: conf("orderQuantity", result.orderQuantity),
    shipmentQuantity: conf("shipmentQuantity", result.shipmentQuantity),
    qtyReadyForInspection: conf("qtyReadyForInspection", result.qtyReadyForInspection),
    inspectedQuantity: conf("inspectedQuantity", result.inspectedQuantity),
    packedQuantity: conf("packedQuantity", result.packedQuantity),
    clientName: conf("clientName", result.clientName),
  };

  return result;
}

const systemPrompt = `You are an expert inspection report parser for quality control reports.

Extract structured data from this inspection report document.

CRITICAL MAPPING RULES:
- Keep these quantities distinct:
  1) orderQuantity = total ordered quantity
  2) shipmentQuantity = planned/actual shipment quantity
  3) qtyReadyForInspection = quantity ready at factory during inspection
  4) inspectedQuantity = quantity sampled/inspected
  5) packedQuantity = quantity packed
- Keep these entities distinct:
  - supplierName (vendor)
  - manufacturer (factory/manufacturer company)
  - inspectorName (person who performed inspection)
  - inspectionDate (actual inspection date)

For key fields, include confidence levels in fieldConfidence using only "high", "medium", or "low".

If a field is unclear or not found in the document, leave it as empty string or 0. NEVER guess values.

For images: extract any image references, photo descriptions, or figure captions found in the document.
Each image should have: url (if available), caption, category (one of: product, defect, packaging, shipping_mark, test, uncategorized), reference.

Return your full extraction as a JSON STRING in the function argument "result".
The JSON should include keys:
productName, supplierName, manufacturer, factoryName, factoryAddress, inspectionDate, poNumber,
orderQuantity, shipmentQuantity, qtyReadyForInspection, inspectedQuantity, packedQuantity,
destinationCountry, inspectorName, inspectionType, productCategory, skuModel, clientName,
inspectorComments,
fieldConfidence, defects, remarks, quantityBreakdown,
aql, tests, measurements, conformity, packagingChecklist, images.

IMPORTANT: Do NOT include any subjective interpretation such as decisions, risk levels, recommendations, business impact, action plans, or supplier scores. Only extract factual inspection data.`;

const tools = [
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
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { fileBase64, mimeType, fileName, fileContent } = body;

    // Support both base64 (new) and text (legacy) modes
    const hasBase64 = !!fileBase64;
    const hasText = !!fileContent;

    if (!hasBase64 && !hasText) {
      return new Response(JSON.stringify({ error: "No file content provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build message content parts
    const userParts: any[] = [];

    if (hasBase64) {
      // Send the document as multimodal inline data (Gemini can read PDFs/images directly)
      userParts.push({
        type: "text",
        text: `Parse this inspection report and extract structured data. File name: ${fileName}`,
      });
      userParts.push({
        type: "image_url",
        image_url: {
          url: `data:${mimeType || "application/pdf"};base64,${fileBase64}`,
        },
      });
    } else {
      // Text mode (DOCX extracted text)
      const maxChars = 200_000;
      const trimmedContent = fileContent.length > maxChars
        ? fileContent.slice(0, maxChars) + "\n\n[Content truncated due to length]"
        : fileContent;
      userParts.push({
        type: "text",
        text: `Parse this inspection report and extract structured data. File name: ${fileName}\n\nContent:\n${trimmedContent}`,
      });
    }

    console.log(`Processing file: ${fileName}, mode: ${hasBase64 ? "base64-multimodal" : "text"}, contentLength: ${hasText ? fileContent.length : "n/a"}`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        max_tokens: 16000,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userParts },
        ],
        tools,
        tool_choice: { type: "function", function: { name: "extract_inspection_data" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI parsing failed: ${response.status}`);
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    const rawArguments = toolCall?.function?.arguments;

    if (!rawArguments) throw new Error("AI did not return structured data");

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
