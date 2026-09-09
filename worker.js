const JSON_HEADERS = {
  "content-type": "application/json; charset=UTF-8",
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, OPTIONS",
  "access-control-allow-headers": "Content-Type",
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: JSON_HEADERS,
  });
}

function wardrobeSystemPrompt() {
  return `
You are WARDROBE ARCHITECT™, an elite personal stylist and wardrobe intelligence engine.

Your job is not merely to describe clothes.
You must reason like:
- a luxury menswear stylist
- a garment construction specialist
- a wardrobe systems architect
- a visual analyst
- a color and proportion expert

CORE PRINCIPLES

1. Never invent hidden garment facts.
If fabric composition, brand, construction, or measurements cannot be verified visually, mark them as unknown or low confidence.

2. Separate observation from interpretation.
OBSERVED = directly visible.
INFERRED = likely but uncertain.
LOCKED FACT = only when user confirms it.

3. Think relationally.
Every garment is a node in a wardrobe network.
Evaluate how it connects with trousers, jackets, shirts, knitwear, shoes, belts, outerwear and accessories.

4. Analyze visual DNA:
- category
- garment type
- color
- undertone
- saturation
- texture
- pattern
- silhouette
- structure
- drape
- proportions
- lapel/collar
- closure
- pockets
- hem
- visible construction
- formality
- seasonality
- styling role

5. Evaluate styling intelligence:
- CORE
- CONNECTOR
- STATEMENT
- SUPPORT
- DEAD WEIGHT
- ANCHOR PIECE

6. Consider:
- compatibility
- outfit potential
- duplication risk
- visual fatigue
- versatility
- quality cues
- fit cues
- occasion range
- palette compatibility

7. Language:
Use the vocabulary of an exceptional stylist.
Be precise, elegant, concise and useful.
Avoid generic fashion clichés.

8. Confidence:
Every uncertain visual conclusion must include confidence from 0 to 1.

9. Never treat price or brand as proof of quality.

10. When analyzing multiple views of the same garment, reconcile all views into one canonical garment model.
`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: JSON_HEADERS,
      });
    }

    if (request.method === "GET" && url.pathname === "/") {
      return json({
        ok: true,
        service: "WARDROBE ARCHITECT VISION",
        version: "1.0",
        status: "ready",
        endpoints: {
          health: "GET /health",
          stylist: "POST /stylist",
          garmentVision: "POST /vision/garment",
        },
      });
    }

    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "wardrobe-architect-vision",
        aiBinding: Boolean(env.AI),
        timestamp: new Date().toISOString(),
      });
    }

    if (request.method === "POST" && url.pathname === "/stylist") {
      try {
        const body = await request.json();

        const prompt =
          body.prompt ||
          body.question ||
          "Give me a sophisticated wardrobe recommendation.";

        const wardrobeContext = body.wardrobeContext || null;
        const occasion = body.occasion || null;
        const weather = body.weather || null;

        const userContent = `
USER REQUEST:
${prompt}

WARDROBE CONTEXT:
${wardrobeContext ? JSON.stringify(wardrobeContext) : "Not provided"}

OCCASION:
${occasion || "Not provided"}

WEATHER:
${weather ? JSON.stringify(weather) : "Not provided"}

Return useful stylist reasoning and a final recommendation.
`;

        const result = await env.AI.run(
          "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
          {
            messages: [
              {
                role: "system",
                content: wardrobeSystemPrompt(),
              },
              {
                role: "user",
                content: userContent,
              },
            ],
          }
        );

        return json({
          ok: true,
          mode: "stylist",
          result,
        });
      } catch (error) {
        return json(
          {
            ok: false,
            error: "stylist_failed",
            message: error?.message || String(error),
          },
          500
        );
      }
    }

    if (request.method === "POST" && url.pathname === "/vision/garment") {
      try {
        const body = await request.json();

        if (!body.image) {
          return json(
            {
              ok: false,
              error: "missing_image",
              message:
                "Send image as a data URL or supported image URL in the 'image' field.",
            },
            400
          );
        }

        const viewType = body.viewType || "unknown";
        const userNotes = body.userNotes || "";
        const knownFacts = body.knownFacts || {};

        const analysisPrompt = `
Analyze ONE garment image for WARDROBE ARCHITECT™.

VIEW TYPE:
${viewType}

USER NOTES:
${userNotes || "None"}

KNOWN / CONFIRMED FACTS:
${JSON.stringify(knownFacts)}

Return ONLY valid JSON.

Use this structure:

{
  "garment": {
    "category": "",
    "subcategory": "",
    "suggested_name": "",
    "primary_color": "",
    "secondary_colors": [],
    "undertone": "",
    "pattern": "",
    "texture": "",
    "silhouette": "",
    "structure": "",
    "drape": "",
    "formality": "",
    "seasonality": [],
    "styling_role": ""
  },
  "construction": {
    "collar_or_lapel": "",
    "closure": "",
    "pockets": "",
    "visible_details": [],
    "quality_cues": [],
    "quality_risks": []
  },
  "fit": {
    "visible_fit_assessment": "",
    "shoulders": "",
    "chest": "",
    "waist": "",
    "length": "",
    "sleeves": "",
    "proportion_notes": []
  },
  "wardrobe_intelligence": {
    "likely_role": "",
    "versatility_score": 0,
    "statement_level": 0,
    "visual_fatigue_risk": 0,
    "best_pairing_colors": [],
    "avoid_pairing_colors": [],
    "best_pairing_categories": [],
    "occasion_range": []
  },
  "observed_facts": [],
  "inferred_facts": [],
  "unknown_facts": [],
  "confidence": {
    "overall": 0,
    "category": 0,
    "color": 0,
    "fit": 0,
    "construction": 0
  },
  "stylist_note": ""
}

Rules:
- Scores are 0-100.
- Confidence values are 0-1.
- Never invent fiber composition from appearance alone.
- Never invent brand.
- Never invent measurements.
- If uncertain, say unknown.
- Distinguish observed from inferred.
`;

        const result = await env.AI.run(
          "@cf/meta/llama-3.2-11b-vision-instruct",
          {
            messages: [
              {
                role: "system",
                content: wardrobeSystemPrompt(),
              },
              {
                role: "user",
                content: analysisPrompt,
              },
            ],
            image: body.image,
            response_format: {
              type: "json_object",
            },
          }
        );

        return json({
          ok: true,
          mode: "garment_vision",
          viewType,
          analysis: result,
        });
      } catch (error) {
        return json(
          {
            ok: false,
            error: "vision_failed",
            message: error?.message || String(error),
          },
          500
        );
      }
    }

    return json(
      {
        ok: false,
        error: "not_found",
        path: url.pathname,
      },
      404
    );
  },
};
