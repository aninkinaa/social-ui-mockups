import { useState } from "react";
import { toPng, toJpeg } from "html-to-image";

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const downloadImage = async (ref, format = "png", filename = "export", method = "client") => {
    if (!ref.current) return;
    setIsExporting(true);

    try {
      if (method === "server") {
        const clone = ref.current.cloneNode(true);
        
        const originalInputs = ref.current.querySelectorAll("input, textarea");
        const clonedInputs = clone.querySelectorAll("input, textarea");
        originalInputs.forEach((input, index) => {
            if (clonedInputs[index]) {
                clonedInputs[index].setAttribute("value", input.value);
            }
        });
        
        const elementsToHide = clone.querySelectorAll(".export-hide");
        elementsToHide.forEach((el) => el.remove());
        
        const elementsToShow = clone.querySelectorAll(".export-show");
        elementsToShow.forEach((el) => {
          el.style.setProperty("display", "flex", "important");
          el.style.setProperty("visibility", "visible", "important");
          el.style.setProperty("opacity", "1", "important");
        });

        const htmlContent = clone.outerHTML;
        const currentBaseUrl = window.location.origin;

        const response = await fetch("/api/export", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            html: htmlContent,
            format: format,
            width: ref.current.offsetWidth,
            height: ref.current.offsetHeight,
            baseUrl: currentBaseUrl,
          }),
        });

        if (!response.ok) throw new Error("Server failed to generate the image.");

        const blob = await response.blob();
        triggerDownload(blob, filename, format);

      } else {
        const elementsToHide = ref.current.querySelectorAll(".export-hide");
        const elementsToShow = ref.current.querySelectorAll(".export-show");
        const scrollElements = ref.current.querySelectorAll(".overflow-y-auto, .overflow-x-auto, .custom-scrollbar");

        elementsToHide.forEach((el) => el.style.setProperty("display", "none", "important"));
        elementsToShow.forEach((el) => el.style.setProperty("display", "flex", "important"));
        scrollElements.forEach((el) => el.style.setProperty("overflow", "hidden", "important"));

        await new Promise((resolve) => setTimeout(resolve, 300));

        const options = {
          quality: 1.0,
          pixelRatio: 2,
          useCORS: true,
          filter: (node) => !node.classList?.contains('export-hide')
        };

        const dataUrl = format === "jpg"
          ? await toJpeg(ref.current, options)
          : await toPng(ref.current, options);

        const response = await fetch(dataUrl);
        const blob = await response.blob();
        triggerDownload(blob, filename, format);

        elementsToHide.forEach((el) => el.style.removeProperty("display"));
        elementsToShow.forEach((el) => el.style.removeProperty("display"));
        scrollElements.forEach((el) => el.style.removeProperty("overflow"));
      }

    } catch (error) {
      console.error("Export Error:", error);
      alert("Gagal mengekspor gambar. Cek konsol untuk detail.");
    } finally {
      setIsExporting(false);
    }
  };

  const triggerDownload = (blob, filename, format) => {
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `${filename}.${format}`;
    link.href = blobUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
  };

  return { downloadImage, isExporting };
}