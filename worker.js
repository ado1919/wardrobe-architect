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

function html(content) {
  return new Response(content, {
    headers: {
      "content-type": "text/html; charset=UTF-8",
    },
  });
}

function systemPrompt() {
  return `
You are WARDROBE ARCHITECT™, an advanced personal wardrobe intelligence system.

Think as:
- luxury menswear stylist
- garment construction specialist
- color and proportion expert
- wardrobe systems architect
- visual garment analyst

CORE RULES

1. Separate OBSERVED FACTS from INFERRED FACTS.
2. Never invent brand, fiber composition, measurements or hidden construction.
3. Uncertain facts must have confidence values.
4. A user-confirmed correction becomes a LOCKED FACT.
5. Judge garments relationally, as nodes inside a wardrobe network.
6. Price and brand are never proof of quality.
7. QUALITY SCORE and BUY SCORE are separate concepts.

WARDROBE ARCHITECT ENGINES

- CONNECTION SCORE
- QUALITY SCORE
- FIT PRECISION
- WARDROBE DENSITY
- CORE / CONNECTOR / STATEMENT / DEAD WEIGHT
- ANCHOR PIECE
- VISUAL FATIGUE
- FUNCTIONAL DUPLICATE CHECK
- UNLOCK VALUE
- OUTFIT ENGINE
- CALENDAR LOGIC
- AUDIENCE ROTATION
- CLEAN / AVAILABLE STATUS

Your language should be precise, elegant and practical.
`;
}

const APP = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0b0b0b">

<title>WARDROBE ARCHITECT™</title>

<style>
*{box-sizing:border-box}
:root{
  --bg:#0b0b0b;
  --panel:#151515;
  --panel2:#1d1d1d;
  --line:#303030;
  --text:#f4f0e8;
  --muted:#9d9a94;
  --gold:#c9a76a;
  --soft:#ebe5d8;
}
body{
  margin:0;
  background:var(--bg);
  color:var(--text);
  font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif;
}
.shell{
  max-width:760px;
  margin:auto;
  padding:22px 18px 110px;
}
.brand{
  padding:18px 0 28px;
}
.brand small{
  color:var(--gold);
  letter-spacing:.25em;
  font-size:11px;
}
.brand h1{
  font-family:Georgia,serif;
  font-weight:400;
  margin:8px 0 4px;
  font-size:32px;
  letter-spacing:.02em;
}
.brand p{
  margin:0;
  color:var(--muted);
}
.hero{
  background:linear-gradient(145deg,#202020,#111);
  border:1px solid var(--line);
  border-radius:26px;
  padding:24px;
  margin-bottom:18px;
}
.hero-label{
  font-size:12px;
  color:var(--gold);
  letter-spacing:.15em;
}
.hero h2{
  font-family:Georgia,serif;
  font-size:30px;
  font-weight:400;
  margin:12px 0;
}
.hero p{
  color:var(--muted);
  line-height:1.55;
}
.statusRow{
  display:flex;
  gap:10px;
  flex-wrap:wrap;
  margin-top:18px;
}
.pill{
  padding:9px 12px;
  border-radius:999px;
  background:#242424;
  border:1px solid #383838;
  font-size:13px;
}
.dot{
  display:inline-block;
  width:8px;height:8px;border-radius:50%;
  background:#777;
  margin-right:7px;
}
.dot.on{background:#9dcc84}
.grid{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
  margin-bottom:18px;
}
.metric{
  background:var(--panel);
  border:1px solid var(--line);
  border-radius:20px;
  padding:17px;
}
.metric strong{
  display:block;
  font-family:Georgia,serif;
  font-size:27px;
  font-weight:400;
}
.metric span{
  color:var(--muted);
  font-size:12px;
}
.card{
  background:var(--panel);
  border:1px solid var(--line);
  border-radius:24px;
  margin:14px 0;
  overflow:hidden;
}
.cardHead{
  padding:20px 20px 5px;
}
.eyebrow{
  color:var(--gold);
  letter-spacing:.18em;
  font-size:10px;
}
.card h3{
  font-family:Georgia,serif;
  font-weight:400;
  margin:6px 0;
  font-size:24px;
}
.cardHead p{
  color:var(--muted);
  line-height:1.45;
  margin:7px 0 10px;
}
.cardBody{
  padding:14px 20px 22px;
}
textarea,input{
  width:100%;
  color:var(--text);
  background:#0e0e0e;
  border:1px solid #3a3a3a;
  border-radius:15px;
  padding:15px;
  font-size:16px;
  outline:none;
}
textarea{
  min-height:115px;
  resize:vertical;
}
button{
  width:100%;
  margin-top:11px;
  background:var(--soft);
  color:#121212;
  border:0;
  border-radius:15px;
  padding:15px;
  font-size:15px;
  font-weight:650;
}
button.secondary{
  background:#252525;
  color:var(--text);
  border:1px solid #3b3b3b;
}
button:disabled{
  opacity:.45;
}
.result{
  display:none;
  margin-top:16px;
  padding:16px;
  background:#0e0e0e;
  border:1px solid #303030;
  border-radius:16px;
  white-space:pre-wrap;
  word-break:break-word;
  color:#dedbd4;
  line-height:1.5;
  font-size:14px;
}
.preview{
  width:100%;
  max-height:360px;
  object-fit:contain;
  margin-top:14px;
  border-radius:16px;
  display:none;
  background:#080808;
}
.filebox{
  position:relative;
  border:1px dashed #4a4a4a;
  border-radius:18px;
  padding:25px;
  text-align:center;
  color:var(--muted);
}
.filebox input{
  position:absolute;
  inset:0;
  opacity:0;
}
.qualityGrid{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
  margin-top:15px;
}
.score{
  border:1px solid #323232;
  border-radius:14px;
  padding:12px 8px;
  text-align:center;
}
.score b{
  display:block;
  font-family:Georgia,serif;
  font-size:22px;
  color:var(--soft);
}
.score small{
  color:var(--muted);
  font-size:10px;
}
.nav{
  position:fixed;
  left:50%;
  transform:translateX(-50%);
  bottom:0;
  width:min(760px,100%);
  background:rgba(15,15,15,.94);
  backdrop-filter:blur(18px);
  border-top:1px solid #303030;
  display:grid;
  grid-template-columns:repeat(4,1fr);
  padding:9px 8px calc(9px + env(safe-area-inset-bottom));
}
.nav div{
  text-align:center;
  font-size:11px;
  padding:8px;
  color:#8d8d8d;
}
.nav div.active{
  color:var(--soft);
}
.loading{
  opacity:.65;
}
@media(max-width:430px){
  .brand h1{font-size:29px}
  .hero h2{font-size:27px}
}
</style>
</head>

<body>
<div class="shell">

  <div class="brand">
    <small>PERSONAL WARDROBE INTELLIGENCE</small>
    <h1>WARDROBE ARCHITECT™</h1>
    <p>Your wardrobe, engineered.</p>
  </div>

  <section class="hero">
    <div class="hero-label">SYSTEM 01</div>
    <h2>Good evening.</h2>
    <p>
      Your wardrobe intelligence layer is online.
      Analyze garments, test the stylist engine and begin building your digital wardrobe.
    </p>

    <div class="statusRow">
      <div class="pill">
        <span id="apiDot" class="dot"></span>
        API <span id="apiText">checking</span>
      </div>

      <div class="pill">
        <span id="aiDot" class="dot"></span>
        AI <span id="aiText">checking</span>
      </div>

      <div class="pill">Vision v1.1</div>
    </div>
  </section>

  <div class="grid">
    <div class="metric">
      <strong>0</strong>
      <span>GARMENTS</span>
    </div>
    <div class="metric">
      <strong>AI</strong>
      <span>STYLIST ENGINE</span>
    </div>
    <div class="metric">
      <strong>0</strong>
      <span>OUTFITS</span>
    </div>
    <div class="metric">
      <strong>∞</strong>
      <span>CONNECTIONS</span>
    </div>
  </div>

  <section class="card">
    <div class="cardHead">
      <div class="eyebrow">AI STYLIST</div>
      <h3>What are you dressing for?</h3>
      <p>
        Ask the wardrobe intelligence engine for styling, color,
        proportion or purchase advice.
      </p>
    </div>

    <div class="cardBody">
      <textarea id="stylistPrompt"
        placeholder="Example: Build an elegant three-color outfit for a work day using beige, navy and cognac."></textarea>

      <button id="stylistButton" onclick="askStylist()">
        Ask WARDROBE ARCHITECT
      </button>

      <div id="stylistResult" class="result"></div>
    </div>
  </section>

  <section class="card">
    <div class="cardHead">
      <div class="eyebrow">VISION ENGINE</div>
      <h3>Analyze a garment</h3>
      <p>
        Upload one clear garment photo. The system will inspect color,
        silhouette, construction, quality cues and wardrobe role.
      </p>
    </div>

    <div class="cardBody">
      <div class="filebox">
        <strong>Choose garment photo</strong><br>
        <small>Front view works best for the first test.</small>
        <input id="imageInput" type="file" accept="image/*" onchange="previewImage()">
      </div>

      <img id="preview" class="preview">

      <button class="secondary" onclick="activateVision()">
        Activate Vision AI
      </button>

      <button id="visionButton" onclick="analyzeGarment()">
        Analyze Garment
      </button>

      <div class="qualityGrid">
        <div class="score">
          <b>—</b>
          <small>QUALITY</small>
        </div>
        <div class="score">
          <b>—</b>
          <small>VERSATILITY</small>
        </div>
        <div class="score">
          <b>—</b>
          <small>CONFIDENCE</small>
        </div>
      </div>

      <div id="visionResult" class="result"></div>
    </div>
  </section>

</div>

<div class="nav">
  <div class="active">HOME</div>
  <div>WARDROBE</div>
  <div>CALENDAR</div>
  <div>AI</div>
</div>

<script>
let selectedImage = null;

async function checkHealth() {
  try {
    const r = await fetch("/health");
    const d = await r.json();

    document.getElementById("apiDot").classList.add("on");
    document.getElementById("apiText").textContent = "online";

    if (d.aiBinding) {
      document.getElementById("aiDot").classList.add("on");
      document.getElementById("aiText").textContent = "connected";
    } else {
      document.getElementById("aiText").textContent = "not bound";
    }
  } catch(e) {
    document.getElementById("apiText").textContent = "offline";
    document.getElementById("aiText").textContent = "unknown";
  }
}

async function askStylist() {
  const prompt = document.getElementById("stylistPrompt").value.trim();
  const result = document.getElementById("stylistResult");
  const btn = document.getElementById("stylistButton");

  if (!prompt) {
    result.style.display = "block";
    result.textContent = "Write a styling question first.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Thinking…";
  result.style.display = "block";
  result.textContent = "WARDROBE ARCHITECT is reasoning…";

  try {
    const r = await fetch("/stylist", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ prompt })
    });

    const d = await r.json();

    if (!d.ok) {
      result.textContent = JSON.stringify(d, null, 2);
    } else {
      result.textContent =
        d.result?.response ||
        d.result?.result ||
        JSON.stringify(d.result, null, 2);
    }
  } catch(e) {
    result.textContent = "Stylist request failed: " + e.message;
  }

  btn.disabled = false;
  btn.textContent = "Ask WARDROBE ARCHITECT";
}

function previewImage() {
  const input = document.getElementById("imageInput");
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = e => {
    selectedImage = e.target.result;
    const img = document.getElementById("preview");
    img.src = selectedImage;
    img.style.display = "block";
  };

  reader.readAsDataURL(file);
}

async function activateVision() {
  const result = document.getElementById("visionResult");
  result.style.display = "block";
  result.textContent = "Activating Vision AI…";

  try {
    const r = await fetch("/vision/agree", {
      method: "POST"
    });
    const d = await r.json();

    if (d.ok) {
      result.textContent =
        "Vision AI activation request completed. You can now test garment analysis.";
    } else {
      result.textContent = JSON.stringify(d, null, 2);
    }
  } catch(e) {
    result.textContent = "Activation failed: " + e.message;
  }
}

async function analyzeGarment() {
  const result = document.getElementById("visionResult");
  const btn = document.getElementById("visionButton");

  if (!selectedImage) {
    result.style.display = "block";
    result.textContent = "Choose a garment photo first.";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Analyzing…";

  result.style.display = "block";
  result.textContent =
    "Reading silhouette, color, construction and wardrobe role…";

  try {
    const r = await fetch("/vision/garment", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({
        image: selectedImage,
        viewType: "front"
      })
    });

    const d = await r.json();

    result.textContent = JSON.stringify(d, null, 2);

  } catch(e) {
    result.textContent = "Vision request failed: " + e.message;
  }

  btn.disabled = false;
  btn.textContent = "Analyze Garment";
}

checkHealth();
</script>
</body>
</html>`;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: JSON_HEADERS,
      });
    }

    // APP HOME
    if (request.method === "GET" && url.pathname === "/") {
      return html(APP);
    }

    // HEALTH
    if (request.method === "GET" && url.pathname === "/health") {
      return json({
        ok: true,
        service: "WARDROBE ARCHITECT",
        version: "1.1",
        aiBinding: Boolean(env.AI),
        timestamp: new Date().toISOString(),
      });
    }

    // ACTIVATE META VISION MODEL LICENSE
    if (request.method === "POST" && url.pathname === "/vision/agree") {
      try {
        if (!env.AI) {
          return json({
            ok: false,
            error: "AI binding is missing",
          }, 500);
        }

        const result = await env.AI.run(
          "@cf/meta/llama-3.2-11b-vision-instruct",
          {
            prompt: "agree",
          }
        );

        return json({
          ok: true,
          activated: true,
          result,
        });

      } catch (error) {
        return json({
          ok: false,
          error: "vision_activation_failed",
          message: error?.message || String(error),
        }, 500);
      }
    }

    // AI STYLIST
    if (request.method === "POST" && url.pathname === "/stylist") {
      try {
        if (!env.AI) {
          return json({
            ok: false,
            error: "AI binding is missing",
          }, 500);
        }

        const body = await request.json();

        const prompt =
          body.prompt ||
          body.question ||
          "Create a sophisticated wardrobe recommendation.";

        const result = await env.AI.run(
          "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
          {
            messages: [
              {
                role: "system",
                content: systemPrompt(),
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            max_tokens: 900,
            temperature: 0.35,
          }
        );

        return json({
          ok: true,
          mode: "stylist",
          result,
        });

      } catch (error) {
        return json({
          ok: false,
          error: "stylist_failed",
          message: error?.message || String(error),
        }, 500);
      }
    }

    // GARMENT VISION
    if (
      request.method === "POST" &&
      url.pathname === "/vision/garment"
    ) {
      try {
        if (!env.AI) {
          return json({
            ok: false,
            error: "AI binding is missing",
          }, 500);
        }

        const body = await request.json();

        if (!body.image) {
          return json({
            ok: false,
            error: "missing_image",
          }, 400);
        }

        const prompt = `
Analyze this garment for WARDROBE ARCHITECT™.

Return ONLY valid JSON.

{
  "identity": {
    "category": "",
    "subcategory": "",
    "suggested_name": ""
  },

  "visual_dna": {
    "primary_color": "",
    "secondary_colors": [],
    "undertone": "",
    "pattern": "",
    "texture": "",
    "silhouette": "",
    "structure": "",
    "drape": "",
    "formality": ""
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
    "assessment": "",
    "shoulders": "",
    "chest": "",
    "waist": "",
    "length": "",
    "sleeves": "",
    "proportion_notes": []
  },

  "wardrobe_intelligence": {
    "role": "",
    "versatility_score": 0,
    "statement_level": 0,
    "visual_fatigue_risk": 0,
    "best_pairing_colors": [],
    "best_pairing_categories": [],
    "occasion_range": [],
    "seasonality": []
  },

  "quality": {
    "visual_quality_score": 0,
    "fabric_quality_visible": "",
    "construction_quality_visible": "",
    "hardware_quality_visible": ""
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

Scores are 0-100.
Confidence values are 0-1.

Never invent:
- brand
- fiber composition
- exact measurements
- hidden construction

Separate observation from inference.
`;

        const result = await env.AI.run(
          "@cf/meta/llama-3.2-11b-vision-instruct",
          {
            messages: [
              {
                role: "system",
                content: systemPrompt(),
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            image: body.image,
            max_tokens: 1300,
            temperature: 0.2,
          }
        );

        let parsed = null;

        try {
          const text =
            result?.response ||
            result?.result ||
            "";

          const clean = String(text)
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

          parsed = JSON.parse(clean);

        } catch (_) {
          parsed = null;
        }

        return json({
          ok: true,
          mode: "garment_vision",
          viewType: body.viewType || "unknown",
          analysis: parsed || result,
        });

      } catch (error) {
        return json({
          ok: false,
          error: "vision_failed",
          message: error?.message || String(error),
        }, 500);
      }
    }

    return json({
      ok: false,
      error: "not_found",
      path: url.pathname,
    }, 404);
  },
};
