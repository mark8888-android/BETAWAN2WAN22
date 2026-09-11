import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true, limit: "50mb" }));

  // Initialize Gemini API client safely with server-side key
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      aiClient = new GoogleGenAI({
        apiKey: process.env.GEMINI_API_KEY,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build",
          },
        },
      });
    }
    return aiClient;
  }

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      models: ["Wan2.1", "Wan2.2"],
      inBrowserEngine: true,
    });
  });

  // Cloned Repositories inspection
  app.get("/api/wan/repos", (_req, res) => {
    try {
      const wan21Path = path.join(process.cwd(), "repos", "Wan2.1");
      const wan22Path = path.join(process.cwd(), "repos", "Wan2.2");

      const wan21Exists = fs.existsSync(wan21Path);
      const wan22Exists = fs.existsSync(wan22Path);

      let wan21Files: string[] = [];
      let wan22Files: string[] = [];
      let wan21ReadmeSnippet = "";
      let wan22ReadmeSnippet = "";

      if (wan21Exists) {
        wan21Files = fs.readdirSync(wan21Path).slice(0, 20);
        const readmePath = path.join(wan21Path, "README.md");
        if (fs.existsSync(readmePath)) {
          wan21ReadmeSnippet = fs.readFileSync(readmePath, "utf-8").slice(0, 1500);
        }
      }

      if (wan22Exists) {
        wan22Files = fs.readdirSync(wan22Path).slice(0, 20);
        const readmePath = path.join(wan22Path, "README.md");
        if (fs.existsSync(readmePath)) {
          wan22ReadmeSnippet = fs.readFileSync(readmePath, "utf-8").slice(0, 1500);
        }
      }

      res.json({
        success: true,
        repos: {
          wan21: {
            name: "Wan-Video/Wan2.1",
            url: "https://github.com/Wan-Video/Wan2.1",
            cloned: wan21Exists,
            files: wan21Files,
            readmeSnippet: wan21ReadmeSnippet,
            license: "Apache-2.0",
            tasks: ["t2v-1.3B", "t2v-14B", "i2v-14B", "flf2v-14B", "vace-1.3B", "vace-14B", "t2i-14B"],
            keyFeatures: [
              "Consumer-grade GPU (RTX 4090 / 3090 / Apple Silicon)",
              "Wan-VAE (3D Causal VAE with 16x temporal compression)",
              "Flow Matching DiT with 1.3B & 14B scales",
              "Bilingual text generation (Chinese & English)",
              "First-and-Last frame conditioning (FLF2V)",
            ],
          },
          wan22: {
            name: "Wan-Video/Wan2.2",
            url: "https://github.com/Wan-Video/Wan2.2",
            cloned: wan22Exists,
            files: wan22Files,
            readmeSnippet: wan22ReadmeSnippet,
            license: "Apache-2.0",
            tasks: ["t2v-A14B", "i2v-A14B", "ti2v-5B", "animate-14B", "s2v-14B"],
            keyFeatures: [
              "Mixture-of-Experts (MoE) DiT architecture",
              "Dual-model boundary scheduling (high-noise & low-noise experts)",
              "Sound-to-Video (S2V) with zero-shot audio conditioning",
              "Video Animation with pose & mask transfer (Animate-14B)",
              "Cinematic aesthetic dataset tuning for dynamic camera movement",
            ],
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // Prompt Enhancement endpoint using Gemini 3.8 Flash
  app.post("/api/gemini/enhance-prompt", async (req, res) => {
    const { prompt, modelType, task, style } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt string is required" });
    }

    try {
      const ai = getGeminiClient();
      if (!ai) {
        // Fallback enhancement if API key is not configured
        const enhancedFallback = `${prompt.trim()}, cinematic 8k masterpiece, photorealistic rendering, dynamic camera motion, natural physical lighting, raytraced reflections, volumetric fog, ultra-detailed textures, smooth temporal consistency, 24fps motion blur, high dynamic range`;
        return res.json({
          enhancedPrompt: enhancedFallback,
          source: "offline_engine",
          tips: "Cinematic camera movement and lighting cues appended.",
        });
      }

      const systemInstruction = `You are an elite Hollywood visual effects supervisor and AI video prompt director specializing in Alibaba Wan-Video models (Wan 2.1 DiT and Wan 2.2 MoE).
Given a user's raw prompt, transform it into a rich, visually stunning, coherent video generation prompt tailored specifically for Wan Video generative architecture.
Focus on:
1. Subject details (textures, materials, expressions, micro-movements)
2. Camera direction (e.g. slow cinematic dolly push, orbital tracking shot, aerial drone, 35mm anamorphic lens, shallow depth of field)
3. Atmospheric lighting (golden hour, soft cinematic rim lighting, volumetric rays, neon reflections, HDR)
4. Fluid physics and motion dynamics (wind fluttering fabric, water ripple reflections, natural momentum)
5. Keep it concise enough for Wan's T5 text encoder (under 120 words), descriptive, and free of hype fluff.
Output ONLY the enhanced prompt string without explanations or quotes.`;

      const userMessage = `User Prompt: "${prompt}"
Model Architecture: ${modelType || "Wan 2.1"}
Task: ${task || "t2v"}
Desired Style: ${style || "Cinematic Realistic"}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const enhanced = response.text?.trim() || prompt;
      res.json({
        enhancedPrompt: enhanced,
        source: "gemini-3.8-flash",
      });
    } catch (err: any) {
      console.error("Gemini enhance prompt error:", err);
      // Graceful fallback
      res.json({
        enhancedPrompt: `${prompt}, cinematic cinematography, dynamic natural motion, photorealistic lighting, sharp detail, 8k resolution`,
        source: "fallback",
        error: err.message,
      });
    }
  });

  // CLI Code Generator for Wan 2.1 and Wan 2.2
  app.post("/api/wan/generate-cli", (req, res) => {
    const {
      model = "Wan2.1",
      task = "t2v-1.3B",
      prompt = "A majestic eagle soaring over snowy mountain peaks at sunset",
      size = "1280*720",
      sampleSteps = 40,
      sampleShift = 5.0,
      guideScale = 5.0,
      frameNum = 81,
      seed = 42,
      imagePath = "examples/i2v_input.JPG",
    } = req.body;

    const isWan21 = model.includes("2.1");
    const repoDir = isWan21 ? "Wan2.1" : "Wan2.2";
    const ckptDir = isWan21 ? `./Wan2.1-${task.toUpperCase()}` : `./Wan2.2-${task.toUpperCase()}`;

    let cliCommand = `python generate.py \\\n  --task ${task} \\\n  --size "${size}" \\\n  --ckpt_dir "${ckptDir}" \\\n  --prompt "${prompt.replace(/"/g, '\\"')}" \\\n  --sample_steps ${sampleSteps} \\\n  --sample_shift ${sampleShift} \\\n  --sample_guide_scale ${guideScale} \\\n  --frame_num ${frameNum} \\\n  --base_seed ${seed}`;

    if (task.includes("i2v")) {
      cliCommand += ` \\\n  --image "${imagePath}"`;
    }

    const bashScript = `#!/usr/bin/env bash
set -e

echo "Running \${0} with Alibaba ${model} (${task})..."

# Check environment
if ! command -v python &> /dev/null; then
    echo "Python is required. Please activate your PyTorch virtualenv."
    exit 1
fi

cd repos/${repoDir}

${cliCommand}

echo "Video saved successfully to output directory!"
`;

    const diffusersPython = `import torch
from diffusers import WanPipeline
from diffusers.utils import export_to_video

# Load Alibaba ${model} Pipeline
pipe = WanPipeline.from_pretrained(
    "Wan-Video/${model}-${task}",
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

prompt = "${prompt.replace(/"/g, '\\"')}"
negative_prompt = "low quality, distorted, blurry, jerky motion"

print("Generating video with Flow-Matching DiT...")
output = pipe(
    prompt=prompt,
    negative_prompt=negative_prompt,
    num_inference_steps=${sampleSteps},
    guidance_scale=${guideScale},
    num_frames=${frameNum},
    height=${size.split("*")[1] || 720},
    width=${size.split("*")[0] || 1280},
    generator=torch.Generator().manual_seed(${seed})
).frames[0]

export_to_video(output, "wan_generated_video.mp4", fps=16)
print("Saved wan_generated_video.mp4!")
`;

    res.json({
      cliCommand,
      bashScript,
      diffusersPython,
      repoDir,
    });
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WanStudio Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
