import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { html, format, width, height, baseUrl } = await req.json();

    const browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      headless: true,
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();

    await page.setViewport({
      width: width || 393,
      height: height || 852,
      deviceScaleFactor: 4, // Retina display sharpness
    });

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
              /* 1. Suntikkan font dengan URL absolute menggunakan baseUrl */
              @font-face {
                font-family: 'SF Pro Text';
                src: url('${baseUrl}/SF-Pro-Text-Regular.otf') format('opentype');
                font-weight: 400;
                font-style: normal;
              }
              @font-face {
                font-family: 'SF Pro Text';
                src: url('${baseUrl}/SF-Pro-Text-Medium.otf') format('opentype');
                font-weight: 500;
                font-style: normal;
              }
              @font-face {
                font-family: 'SF Pro Text';
                src: url('${baseUrl}/SF-Pro-Text-Semibold.otf') format('opentype');
                font-weight: 600;
                font-style: normal;
              }
              @font-face {
                font-family: 'SF Pro Text';
                src: url('${baseUrl}/SF-Pro-Text-Bold.otf') format('opentype');
                font-weight: 700;
                font-style: normal;
              }
              @font-face {
                font-family: 'SF Pro Text';
                src: url('${baseUrl}/SF-Pro-Text-Heavy.otf') format('opentype');
                font-weight: 800;
                font-style: normal;
              }

              /* 2. Tambahkan antialiasing seperti di file CSS utama kamu */
              body { 
                  margin: 0; 
                  padding: 0; 
                  font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif;
                  background: #000;
                  -webkit-font-smoothing: antialiased;
                  -moz-osx-font-smoothing: grayscale;
                  text-rendering: optimizeLegibility;
              }
              .export-hide { display: none !important; }
              .export-show { display: flex !important; }
          </style>
          <script>
            // 3. Paksa Tailwind CDN untuk memakai font SF Pro Text sebagai default sans
            tailwind.config = {
                theme: {
                    extend: {
                        fontFamily: { 
                            sans: ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'] 
                        }
                    }
                }
            }
          </script>
      </head>
      <body>
          ${html}
      </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: ["load", "networkidle0"] });

    await new Promise(r => setTimeout(r, 500));

    const element = await page.$("body > div");
    
    if (!element) {
        throw new Error("Element not found for screenshot");
    }

    const imageBuffer = await element.screenshot({
      type: format === "jpg" ? "jpeg" : "png",
      quality: format === "jpg" ? 100 : undefined,
      omitBackground: true
    });

    await browser.close();

    return new NextResponse(imageBuffer, {
      headers: {
        "Content-Type": `image/${format === "jpg" ? "jpeg" : "png"}`,
        "Content-Disposition": `attachment; filename="export.${format}"`,
      },
    });

  } catch (error) {
    console.error("Puppeteer Export Error:", error);
    return NextResponse.json({ error: "Failed to generate image" }, { status: 500 });
  }
}