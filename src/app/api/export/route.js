import puppeteer from "puppeteer";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

function getFontBase64(filename) {
    try {
        const filePath = path.join(process.cwd(), 'public', filename);
        return fs.readFileSync(filePath).toString('base64');
    } catch (e) {
        console.error(`Font file not found: ${filename}`, e);
        return "";
    }
}

export async function POST(req) {
  try {
    const { html, format, width, height } = await req.json();

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
      deviceScaleFactor: 4,
    });

    const regular = getFontBase64('SF-Pro-Text-Regular.otf');
    const medium = getFontBase64('SF-Pro-Text-Medium.otf');
    const bold = getFontBase64('SF-Pro-Text-Bold.otf');

    const fullHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
              @font-face {
                font-family: 'SF Pro Text';
                src: url('data:font/opentype;base64,${regular}') format('opentype');
                font-weight: 400;
              }
              @font-face {
                font-family: 'SF Pro Text';
                src: url('data:font/opentype;base64,${medium}') format('opentype');
                font-weight: 500;
              }
              @font-face {
                font-family: 'SF Pro Text';
                src: url('data:font/opentype;base64,${bold}') format('opentype');
                font-weight: 700;
              }

              body { 
                  margin: 0; 
                  padding: 0; 
                  font-family: 'SF Pro Text', sans-serif;
                  background: #000;
                  -webkit-font-smoothing: antialiased;
              }
          </style>
      </head>
      <body>
          ${html}
      </body>
      </html>
    `;

    await page.setContent(fullHtml, { waitUntil: ["load", "networkidle0"] });
    await page.evaluateHandle('document.fonts.ready');

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