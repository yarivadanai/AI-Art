"use client";

import { useMemo, useRef, useEffect } from "react";
import { mulberry32 } from "@/lib/engine/rng";

// ── Generic display components ──────────────────────────────────────────────

function ScrollableGrid({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="w-full max-h-[500px] overflow-auto bg-[#050505] border border-border p-4 font-mono text-[10px] sm:text-xs text-green-400/80 leading-relaxed">
      <table className="w-full">
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left pr-4 pb-2 text-green-400/50 border-b border-green-400/20">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-green-400/5">
              {row.map((cell, j) => (
                <td key={j} className="pr-4 py-0.5">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ScrollableText({ text }: { text: string }) {
  return (
    <div className="w-full max-h-[500px] overflow-auto bg-[#050505] border border-border p-4 font-mono text-[10px] sm:text-xs text-green-400/80 whitespace-pre-wrap break-all leading-relaxed select-all">
      {text}
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function rngInt(rng: () => number, min: number, max: number) {
  return Math.floor(rng() * (max - min + 1)) + min;
}

function rngHexChar(rng: () => number) {
  return "0123456789abcdef"[Math.floor(rng() * 16)];
}

function rngHexString(rng: () => number, len: number) {
  let s = "";
  for (let i = 0; i < len; i++) s += rngHexChar(rng);
  return s;
}

// ── Section 2: Parallel State ───────────────────────────────────────────────

function ParticleField({ clientSeed }: { clientSeed: number }) {
  const { headers, rows } = useMemo(() => {
    const rng = mulberry32(clientSeed);
    // Generate 5000 velocity vectors (matching Python exactly)
    const velocities: [number, number][] = [];
    for (let i = 0; i < 5000; i++) {
      velocities.push([rng() * 200 - 100, rng() * 200 - 100]);
    }
    // Plant: pick 2 indices from stream, make idx2 = idx1
    const idx1 = rngInt(rng, 0, 2499);
    const idx2 = rngInt(rng, 2500, 4999);
    velocities[idx2] = [velocities[idx1][0], velocities[idx1][1]];
    // Build rows
    const r: string[][] = velocities.map(([vx, vy], i) => [
      String(i), vx.toFixed(4), vy.toFixed(4),
    ]);
    return { headers: ["ID", "Vx", "Vy"], rows: r };
  }, [clientSeed]);
  return <ScrollableGrid headers={headers} rows={rows} />;
}

function HexStreamGrid({ clientSeed }: { clientSeed: number }) {
  const { headers, rows } = useMemo(() => {
    const rng = mulberry32(clientSeed);
    // Generate 1000 hex streams (64 chars each)
    const streams: string[] = [];
    for (let i = 0; i < 1000; i++) {
      streams.push(rngHexString(rng, 64));
    }
    // Pick 3 indices and shared subsequence from stream (matching Python)
    const indices = [
      rngInt(rng, 0, 333),
      rngInt(rng, 334, 666),
      rngInt(rng, 667, 999),
    ].sort((a, b) => a - b);
    const sharedSub = rngHexString(rng, 8);
    // Plant shared subsequence at position 0 of each selected stream
    for (const idx of indices) {
      const chars = streams[idx].split("");
      for (let c = 0; c < 8; c++) {
        chars[c] = sharedSub[c];
      }
      streams[idx] = chars.join("");
    }
    const r: string[][] = streams.map((s, i) => [String(i), s]);
    return { headers: ["ID", "Hex Stream"], rows: r };
  }, [clientSeed]);
  return <ScrollableGrid headers={headers} rows={rows} />;
}

function PrimeMatrix({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const cells: number[] = [];
    for (let i = 0; i < 10000; i++) {
      cells.push(rngInt(rng, 0, 255));
    }
    const px = rngInt(rng, 0, 99);
    const py = rngInt(rng, 0, 99);
    cells[py * 100 + px] = 251;
    const lines: string[] = [];
    lines.push("     " + Array.from({ length: 100 }, (_, i) => String(i).padStart(3)).join(""));
    for (let y = 0; y < 100; y++) {
      const row = cells.slice(y * 100, y * 100 + 100).map(v => v.toString(16).padStart(2, "0").toUpperCase());
      lines.push(String(y).padStart(3) + ": " + row.join(" "));
    }
    return lines.join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

function FrequencyDisplay({ clientSeed }: { clientSeed: number }) {
  const { headers, rows } = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const r: string[][] = [];
    for (let i = 0; i < 50; i++) {
      const amp = (rng() * 10).toFixed(6);
      const freq = (rng() * 5 + 0.1).toFixed(6);
      const phase = (rng() * 2 * Math.PI).toFixed(6);
      r.push([String(i), amp, freq, phase]);
    }
    return { headers: ["Wave", "Amplitude", "Frequency", "Phase"], rows: r };
  }, [clientSeed]);
  return <ScrollableGrid headers={headers} rows={rows} />;
}

function LedgerDisplay({ clientSeed }: { clientSeed: number }) {
  const { headers, rows } = useMemo(() => {
    const rng = mulberry32(clientSeed);
    let ts = 1000000;
    const deltas: number[] = [];
    const r: string[][] = [];
    for (let i = 0; i < 500; i++) {
      const delta = rngInt(rng, 1, 100);
      ts += delta;
      const amount = rngInt(rng, 100, 99999);
      deltas.push(delta);
      r.push([`TX_${String(i).padStart(6, "0")}`, String(ts), String(delta), String(amount)]);
    }
    const plantIdx = rngInt(rng, 0, 499);
    // Plant: make delta divisible by 7
    const oldDelta = deltas[plantIdx];
    const newDelta = oldDelta % 7 === 0 ? oldDelta : oldDelta + (7 - oldDelta % 7);
    r[plantIdx][2] = String(newDelta);
    // Fix others that accidentally have delta % 7 == 0
    for (let i = 0; i < 500; i++) {
      if (i !== plantIdx && parseInt(r[i][2]) % 7 === 0) {
        r[i][2] = String(parseInt(r[i][2]) + 1);
      }
    }
    return { headers: ["TX_ID", "Timestamp", "Delta", "Amount"], rows: r };
  }, [clientSeed]);
  return <ScrollableGrid headers={headers} rows={rows} />;
}

// ── Section 3: Recursive Exec ───────────────────────────────────────────────

function FSMDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const i = clientSeed - 3300;
    const numInputs = 25000 + i;
    const inputs: number[] = [];
    for (let j = 0; j < numInputs; j++) {
      inputs.push(rngInt(rng, 0, 255));
    }
    const lines = [
      `FSM: 50 states, rule: state = (state + input%7) % 50`,
      `Total inputs: ${numInputs}`,
      ``,
      "First 100 inputs:",
      inputs.slice(0, 100).join(", "),
      "",
      "Last 100 inputs:",
      inputs.slice(-100).join(", "),
    ];
    return lines.join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

// ── Section 4: Micro Pattern ────────────────────────────────────────────────

function VarianceDriftDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const numFloats = 100000;
    const blockSize = 15;
    // Pick plant start from stream (matches Python exactly)
    const plantStart = rngInt(rng, 1000, numFloats - blockSize - 1000);
    // Generate all floats via Box-Muller (matching Python)
    const floats: number[] = [];
    for (let k = 0; k < Math.floor(numFloats / 2) + 1; k++) {
      const u1 = Math.max(rng(), 1e-10);
      const u2 = rng();
      floats.push(Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2));
      floats.push(Math.sqrt(-2 * Math.log(u1)) * Math.sin(2 * Math.PI * u2));
    }
    floats.length = numFloats;
    // Plant drift block
    for (let j = plantStart; j < plantStart + blockSize; j++) {
      floats[j] *= 1.05;
    }
    // Render: show surrounding region of plant + head/tail
    const lines: string[] = [];
    lines.push(`100,000 N(0,1) floats [seed ${clientSeed}]`);
    lines.push(`One block of ${blockSize} consecutive values has variance drift (x1.05).`);
    lines.push("");
    lines.push("--- Indices 0-99 ---");
    for (let j = 0; j < 100; j++) {
      lines.push(`[${String(j).padStart(6)}] ${floats[j].toFixed(8)}`);
    }
    lines.push("");
    lines.push(`--- Indices ${numFloats - 100}-${numFloats - 1} ---`);
    for (let j = numFloats - 100; j < numFloats; j++) {
      lines.push(`[${String(j).padStart(6)}] ${floats[j].toFixed(8)}`);
    }
    lines.push("");
    lines.push(`Total values: ${numFloats}. Full data reconstructable from seed ${clientSeed}.`);
    return lines.join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

function BitwisePalindromeDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const numChars = 50000;
    // Generate full hex string (matching Python)
    const chars = rngHexString(rng, numChars).split("");
    // Pick plant start from stream
    const plantStart = rngInt(rng, 100, numChars - 65);
    // Generate 32-char half, mirror to palindrome
    const half = rngHexString(rng, 32);
    const palindrome = half + half.split("").reverse().join("");
    for (let j = 0; j < 64; j++) {
      chars[plantStart + j] = palindrome[j];
    }
    // Render full 50K hex string with line numbers
    const full = chars.join("");
    const lines: string[] = [];
    lines.push(`50,000 hex characters [seed ${clientSeed}]`);
    lines.push("Find the 64-char block that is a perfect palindrome.");
    lines.push("");
    const charsPerLine = 100;
    for (let offset = 0; offset < numChars; offset += charsPerLine) {
      const chunk = full.slice(offset, offset + charsPerLine);
      lines.push(`[${String(offset).padStart(5)}] ${chunk}`);
    }
    return lines.join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

function TaylorSeriesDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const numFloats = 250000;
    const target = [0.0, 1.0, 0.0, -1.0 / 6.0, 0.0, 1.0 / 120.0, 0.0];
    // Generate float stream [-1, 1]
    const floats: number[] = [];
    for (let k = 0; k < numFloats; k++) {
      floats.push(rng() * 2 - 1);
    }
    // Plant target at deterministic index
    const plantIdx = rngInt(rng, 10000, numFloats - 8);
    for (let j = 0; j < 7; j++) {
      floats[plantIdx + j] = target[j];
    }
    // Render first 500 + last 500 with line numbers
    const lines: string[] = [];
    lines.push(`250,000 floats in [-1, 1] [seed ${clientSeed}]`);
    lines.push("Target: 7 consecutive values matching sin(x) Maclaurin: [0, 1, 0, -1/6, 0, 1/120, 0]");
    lines.push("");
    lines.push("--- Indices 0-499 ---");
    for (let j = 0; j < 500; j++) {
      lines.push(`[${String(j).padStart(6)}] ${floats[j].toFixed(8)}`);
    }
    lines.push("");
    lines.push(`--- Indices ${numFloats - 500}-${numFloats - 1} ---`);
    for (let j = numFloats - 500; j < numFloats; j++) {
      lines.push(`[${String(j).padStart(6)}] ${floats[j].toFixed(8)}`);
    }
    lines.push("");
    lines.push(`Total values: ${numFloats}. Full data reconstructable from seed ${clientSeed}.`);
    return lines.join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

function HashAnomalyDisplay({ clientSeed }: { clientSeed: number }) {
  const { headers, rows } = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const numStrings = 10000;
    // Generate 10000 hex strings (64 chars = 32 bytes each), matching Python
    const strings: string[] = [];
    for (let k = 0; k < numStrings; k++) {
      strings.push(rngHexString(rng, 64));
    }
    // Pick plant index from stream
    const plantIdx = rngInt(rng, 0, numStrings - 1);
    // The Python brute-forces a suffix for the planted string.
    // We can't run SHA-256 client-side in useMemo synchronously for 1M attempts,
    // but we CAN reconstruct the base string for display. The planted string
    // was modified by Python and stored in the JSON answer. Show the strings as-is
    // (pre-modification) so the user sees the full dataset.
    // Mark the planted index string with a note.
    const r: string[][] = strings.map((s, i) => [
      String(i).padStart(5), s,
    ]);
    return {
      headers: ["Index", "32-byte Hex String"],
      rows: r,
    };
  }, [clientSeed]);
  return (
    <div className="space-y-2">
      <div className="text-green-400/50 font-mono text-[10px] px-4">
        10,000 hex strings [seed {clientSeed}]. One string&apos;s SHA-256 hash begins with &apos;00000&apos;.
        Note: the planted string was modified by the generator -- the index is the answer.
      </div>
      <ScrollableGrid headers={headers} rows={rows} />
    </div>
  );
}

function SteganCanvas({ clientSeed }: { clientSeed: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const plantCoords = useMemo(() => {
    const rng = mulberry32(clientSeed);
    return { x: rngInt(rng, 0, 1023), y: rngInt(rng, 0, 1023) };
  }, [clientSeed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size = 1024;
    const imgData = ctx.createImageData(size, size);
    const rng = mulberry32(clientSeed);
    // Consume the first 2 values (plant_x, plant_y) to stay in sync
    rng(); rng(); // for rngInt calls

    // Generate pixel data from PRNG stream
    for (let i = 0; i < size * size; i++) {
      const off = i * 4;
      // Generate R, G, B with even LSBs (clear bit 0) so none accidentally form 7
      const r = rngInt(rng, 0, 255) & 0xFE;
      const g = rngInt(rng, 0, 255) & 0xFE;
      const b = rngInt(rng, 0, 255) & 0xFE;
      imgData.data[off] = r;
      imgData.data[off + 1] = g;
      imgData.data[off + 2] = b;
      imgData.data[off + 3] = 255;
    }

    // Plant the target pixel: set all LSBs to 1
    const plantOff = (plantCoords.y * size + plantCoords.x) * 4;
    imgData.data[plantOff] |= 1;
    imgData.data[plantOff + 1] |= 1;
    imgData.data[plantOff + 2] |= 1;

    ctx.putImageData(imgData, 0, 0);
  }, [clientSeed, plantCoords]);

  return (
    <div className="space-y-2">
      <div className="text-green-400/50 font-mono text-[10px] px-1">
        1024x1024 RGBA pixel array [seed {clientSeed}]. Find the pixel where LSB(R,G,B) = 111 (binary 7).
      </div>
      <div className="w-full overflow-auto bg-[#050505] border border-border p-2">
        <canvas
          ref={canvasRef}
          width={1024}
          height={1024}
          className="max-w-full h-auto"
          style={{ imageRendering: "pixelated" }}
        />
      </div>
    </div>
  );
}

// ── Section 5: Attentional ──────────────────────────────────────────────────

function DigitStream({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const digits: string[] = [];
    for (let i = 0; i < 15; i++) {
      digits.push(String(rngInt(rng, 0, 9)));
    }
    return `Target 15-digit sequence:\n\n${digits.join(" ")}`;
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

function BooleanGrid({ clientSeed }: { clientSeed: number }) {
  const { headers, rows } = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const r: string[][] = [];
    for (let t = 0; t < 25; t++) {
      const tl = rng() > 0.5 ? "T" : "F";
      const tr = rng() > 0.5 ? "T" : "F";
      const bl = rng() > 0.5 ? "T" : "F";
      const br = rng() > 0.5 ? "T" : "F";
      r.push([String(t), tl, tr, bl, br]);
    }
    return { headers: ["Step", "TL", "TR", "BL", "BR"], rows: r };
  }, [clientSeed]);
  return <ScrollableGrid headers={headers} rows={rows} />;
}

function NBackDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const abcd = ["A", "B", "C", "D"];
    const wxyz = ["W", "X", "Y", "Z"];
    const visual: string[] = [];
    const audio: string[] = [];
    for (let i = 0; i < 20; i++) {
      visual.push(abcd[Math.floor(rng() * 4)]);
    }
    for (let i = 0; i < 20; i++) {
      audio.push(wxyz[Math.floor(rng() * 4)]);
    }
    const lines = [
      "Visual stream (3-back): " + visual.join(" "),
      "Audio stream (2-back):  " + audio.join(" "),
      "",
      "V=visual match, A=audio match, B=both, N=neither",
    ];
    return lines.join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

function NodeGraph({ clientSeed }: { clientSeed: number }) {
  const { headers, rows } = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const r: string[][] = [];
    for (let id = 0; id < 20; id++) {
      const x = (rng() * 100).toFixed(2);
      const y = (rng() * 100).toFixed(2);
      r.push([String(id), x, y]);
    }
    return { headers: ["Node", "X", "Y"], rows: r };
  }, [clientSeed]);
  return <ScrollableGrid headers={headers} rows={rows} />;
}

function CipherDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const plaintext: string[] = [];
    for (let i = 0; i < 20; i++) {
      plaintext.push(alpha[Math.floor(rng() * 26)]);
    }
    const key = [...alpha];
    for (let j = 25; j > 0; j--) {
      const k = rngInt(rng, 0, j);
      [key[j], key[k]] = [key[k], key[j]];
    }
    const lines = [
      "Plaintext:  " + plaintext.join(""),
      "",
      "Substitution key:",
      "  " + alpha.join(" "),
      "  " + key.join(" "),
    ];
    return lines.join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

// ── Section 6: Bayesian ─────────────────────────────────────────────────────

function HMMDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const nStates = 5;
    const nObs = 4;
    const seqLen = 500;
    const trans: number[][] = [];
    for (let s = 0; s < nStates; s++) {
      const row: number[] = [];
      let total = 0;
      for (let j = 0; j < nStates; j++) { const v = rng(); row.push(v); total += v; }
      trans.push(row.map(v => v / total));
    }
    const emit: number[][] = [];
    for (let s = 0; s < nStates; s++) {
      const row: number[] = [];
      let total = 0;
      for (let j = 0; j < nObs; j++) { const v = rng(); row.push(v); total += v; }
      emit.push(row.map(v => v / total));
    }
    const init: number[] = [];
    let initTotal = 0;
    for (let s = 0; s < nStates; s++) { const v = rng(); init.push(v); initTotal += v; }
    const initNorm = init.map(v => v / initTotal);
    const obs: number[] = [];
    for (let t = 0; t < seqLen; t++) { obs.push(rngInt(rng, 0, nObs - 1)); }
    const lines = [
      `HMM: ${nStates} states, ${nObs} observation symbols, ${seqLen} steps`,
      "",
      "Initial probabilities:",
      "  " + initNorm.map(v => v.toFixed(6)).join("  "),
      "",
      "Transition matrix:",
      ...trans.map((row, s) => `  S${s}: ` + row.map(v => v.toFixed(6)).join("  ")),
      "",
      "Emission matrix:",
      ...emit.map((row, s) => `  S${s}: ` + row.map(v => v.toFixed(6)).join("  ")),
      "",
      `Observation sequence (all ${seqLen}):`,
      "  " + obs.join(", "),
    ];
    return lines.join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

function GMMDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const centers: number[] = [];
    for (let k = 0; k < 3; k++) { centers.push(rng() * 10); }
    const dataPoints: number[] = [];
    for (let j = 0; j < 1000; j++) {
      const cluster = rngInt(rng, 0, 2);
      const noise = (rng() - 0.5) * 2;
      dataPoints.push(centers[cluster] + noise);
    }
    const lines = [
      "3-cluster 1D GMM",
      "",
      "Initial cluster centers:",
      ...centers.map((c, k) => `  Cluster ${k}: ${c.toFixed(6)}`),
      "",
      "Data points (all 1000):",
      ...dataPoints.map((v, j) => `  [${String(j).padStart(4)}] ${v.toFixed(6)}`),
    ];
    return lines.join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

// ── Section 7: Crypto Bitwise ───────────────────────────────────────────────

function XorDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const strings: string[] = [];
    for (let k = 0; k < 5; k++) {
      strings.push(rngHexString(rng, 256).toUpperCase());
    }
    return ["Five 1024-bit hex strings:", "", ...strings.map((s, i) => `String ${i}: ${s}`)].join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

function AESDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const matrix: number[] = [];
    for (let i = 0; i < 16; i++) { matrix.push(rngInt(rng, 0, 255)); }
    const lines = ["4x4 AES State Matrix (column-major):", ""];
    for (let r = 0; r < 4; r++) {
      const row: string[] = [];
      for (let c = 0; c < 4; c++) {
        row.push(matrix[r + 4 * c].toString(16).padStart(2, "0").toUpperCase());
      }
      lines.push(`  Row ${r}: ${row.join("  ")}`);
    }
    return lines.join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

function BitShiftDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    return `256-bit initial value:\n\n${rngHexString(rng, 64).toUpperCase()}`;
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

function Sha256ChDisplay({ clientSeed }: { clientSeed: number }) {
  const text = useMemo(() => {
    const rng = mulberry32(clientSeed);
    const e = rngInt(rng, 0, 0xFFFFFFFF);
    const f = rngInt(rng, 0, 0xFFFFFFFF);
    const g = rngInt(rng, 0, 0xFFFFFFFF);
    return [
      "SHA-256 Ch(e, f, g) function",
      "",
      `E = ${(e >>> 0).toString(16).padStart(8, "0").toUpperCase()}`,
      `F = ${(f >>> 0).toString(16).padStart(8, "0").toUpperCase()}`,
      `G = ${(g >>> 0).toString(16).padStart(8, "0").toUpperCase()}`,
      "",
      "Ch(e,f,g) = (e AND f) XOR (NOT e AND g)",
    ].join("\n");
  }, [clientSeed]);
  return <ScrollableText text={text} />;
}

// ── Router ──────────────────────────────────────────────────────────────────

const RENDERER_MAP: Record<string, React.FC<{ clientSeed: number }>> = {
  // Section 2: Parallel State
  n_body_collision: ParticleField,
  hex_stream_sync: HexStreamGrid,
  prime_matrix_async: PrimeMatrix,
  frequency_phase: FrequencyDisplay,
  ledger_anomaly: LedgerDisplay,
  // Section 3: Recursive Exec
  deep_fsm: FSMDisplay,
  // Section 4: Micro Pattern
  variance_drift: VarianceDriftDisplay,
  bitwise_palindrome: BitwisePalindromeDisplay,
  taylor_series: TaylorSeriesDisplay,
  hash_anomaly: HashAnomalyDisplay,
  lsb_steganography: SteganCanvas,
  // Section 5: Attentional
  async_multi_axis: DigitStream,
  quad_logic_inversion: BooleanGrid,
  n_back_desync: NBackDisplay,
  trajectory_spline: NodeGraph,
  peripheral_cipher: CipherDisplay,
  // Section 6: Bayesian
  hmm_viterbi: HMMDisplay,
  gmm_update: GMMDisplay,
  // Section 7: Crypto Bitwise
  xor_1024bit: XorDisplay,
  aes_state_matrix: AESDisplay,
  bit_shift_matrix: BitShiftDisplay,
  sha256_mental: Sha256ChDisplay,
};

export function SeedDataDisplay({
  clientSeed,
  questionType,
}: {
  clientSeed: number;
  questionType: string;
}) {
  const Renderer = RENDERER_MAP[questionType];
  if (!Renderer) {
    return (
      <div className="w-full bg-[#050505] border border-border p-4 font-mono text-xs text-green-400/80">
        [Data generated from seed {clientSeed}]
      </div>
    );
  }
  return <Renderer clientSeed={clientSeed} />;
}
