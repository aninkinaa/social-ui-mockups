import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

let cachedFonts = null;
function getFonts() {
    if (cachedFonts) return cachedFonts;
    try {
        const getBase64 = (filename) => {
            const filePath = path.join(process.cwd(), 'public', filename);
            if (fs.existsSync(filePath)) {
                return fs.readFileSync(filePath).toString('base64');
            }
            return "";
        };
        cachedFonts = {
            regular: getBase64('SF-Pro-Text-Regular.otf'),
            medium: getBase64('SF-Pro-Text-Medium.otf'),
            bold: getBase64('SF-Pro-Text-Bold.otf')
        };
        return cachedFonts;
    } catch (e) {
        return { regular: "", medium: "", bold: "" };
    }
}

const exportOverrides = `
  /* 1. TARGET CLASS TAILWIND ASLI: Naikin blur, benerin glitch opacity */
  .bg-white\\/25.backdrop-blur-\\[45px\\] {
    background-color: rgba(255, 255, 255, 0.42) !important;
    
    /* Paksa blur 100px buat nutupin layar retina 4x di Docker */
    backdrop-filter: blur(100px) !important;
    -webkit-backdrop-filter: blur(100px) !important;
    
    /* Kunci layer biar SwiftShader ga bocor */
    transform: translateZ(0) !important; 
    animation: none !important;
  }

  /* 2. Matiin mask gradient (Biang kerok blur pudar di kanan/bawah) */
  .bg-white\\/25.backdrop-blur-\\[45px\\] .custom-scrollbar {
    mask-image: none !important;
    -webkit-mask-image: none !important;
  }

  /* 3. Sembunyikan bottom bar (pesawat/love) di belakang panel */
  body:has(.bg-white\\/25.backdrop-blur-\\[45px\\]) .bg-\\[\\#0F0F0F\\].z-20 {
      opacity: 0 !important;
      pointer-events: none !important;
  }

  /* 4. DM Ngambang: Pakai class bawaan lu (backdrop-blur-lg) */
  .backdrop-blur-lg {
      background-color: rgba(255, 255, 255, 0.45) !important;
      backdrop-filter: blur(24px) !important;
      -webkit-backdrop-filter: blur(24px) !important;
  }
`;

export async function POST(req) {
  let browser = null;
  try {
    const { html, format, width, height } = await req.json();
    const fonts = getFonts();

    browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      headless: "new",
      protocolTimeout: 120000, 
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--ignore-gpu-blocklist',
        '--use-gl=swiftshader',
        '--enable-features=SharedArrayBuffer',
        '--disable-extensions',
        '--disable-background-networking',
      ]
    });
    
    const page = await browser.newPage();

    page.setDefaultNavigationTimeout(30000);
    page.setDefaultTimeout(30000);

    await page.setViewport({
      width: width || 393,
      height: height || 852,
      deviceScaleFactor: 4,
    });

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
              @font-face { font-family: 'SF Pro Text'; src: url('data:font/opentype;base64,${fonts.regular}') format('opentype'); font-weight: 400; font-style: normal; }
              @font-face { font-family: 'SF Pro Text'; src: url('data:font/opentype;base64,${fonts.medium}') format('opentype'); font-weight: 500; font-style: normal; }
              @font-face { font-family: 'SF Pro Text'; src: url('data:font/opentype;base64,${fonts.bold}') format('opentype'); font-weight: 700; font-style: normal; }

              * { box-sizing: border-box !important; }
              html, body { width: ${width || 393}px; height: ${height || 852}px; overflow: hidden !important; }
              ::-webkit-scrollbar { display: none !important; }

              body { 
                  margin: 0; 
                  padding: 0; 
                  font-family: 'SF Pro Text', "Apple Color Emoji", -apple-system, sans-serif;
                  background: #000;
                  -webkit-font-smoothing: antialiased;
              }
              .export-hide { display: none !important; }
              .export-show { display: flex !important; }
              
              /* SUNTIKAN CSS DOCKER */
              ${exportOverrides}
          </style>
          <script>
            tailwind.config = { theme: { extend: { fontFamily: { sans: ['"SF Pro Text"', 'sans-serif'] } } } }
          </script>
      </head>
      <body>
          ${html}
      </body>
      </html>
    `;

    // Pake "load" biar nunggu HTML dan font kelar
    await page.setContent(fullHtml, { waitUntil: "load", timeout: 30000 });

    // Kasih waktu 2 detik (2000ms) buat CPU (SwiftShader) ngelukis efek blurnya
    await new Promise(r => setTimeout(r, 2000));

    const element = await page.$("body > div");
    if (!element) throw new Error("Element not found for screenshot");

    const imageBuffer = await element.screenshot({
      type: format === "jpg" ? "jpeg" : "png",
      quality: format === "jpg" ? 100 : undefined,
      omitBackground: true
    });

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": `image/${format === "jpg" ? "jpeg" : "png"}`,
        "Content-Disposition": `attachment; filename="export.${format}"`,
      },
    });

  } catch (error) {
    console.error("Puppeteer Export Error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}