import { useState } from "react";
import { toPng, toJpeg } from "html-to-image";

export function useExport() {
  const [isExporting, setIsExporting] = useState(false);

  const downloadImage = async (ref, format = "png", filename = "export") => {
    if (!ref.current) return;
    setIsExporting(true);

    try {
      const elementsToHide = ref.current.querySelectorAll(".export-hide");
      const elementsToShow = ref.current.querySelectorAll(".export-show");
      const scrollElements = ref.current.querySelectorAll(".overflow-y-auto, .overflow-x-auto, .custom-scrollbar");

      elementsToHide.forEach((el) => el.style.setProperty("display", "none", "important"));
      elementsToShow.forEach((el) => el.style.setProperty("display", "flex", "important"));
      scrollElements.forEach((el) => el.style.setProperty("overflow", "hidden", "important"));

      await new Promise((resolve) => setTimeout(resolve, 500));

      const options = {
        quality: 1.0,
        pixelRatio: 4, 
        useCORS: true,
        cacheBust: true,
        filter: (node) => {
            if (node.classList && node.classList.contains('export-hide')) return false;
            return true;
        }
      };

      await toPng(ref.current, options);
      
      const dataUrl = format === "jpg"
        ? await toJpeg(ref.current, options)
        : await toPng(ref.current, options);

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      triggerDownload(blob, filename, format);

      elementsToHide.forEach((el) => el.style.removeProperty("display"));
      elementsToShow.forEach((el) => el.style.removeProperty("display"));
      scrollElements.forEach((el) => el.style.removeProperty("overflow"));

    } catch (error) {
      console.error("Export Error:", error);
      alert("Gagal mengekspor gambar. Cek konsol untuk detail.");
      
      const elementsToHide = ref.current.querySelectorAll(".export-hide");
      const elementsToShow = ref.current.querySelectorAll(".export-show");
      const scrollElements = ref.current.querySelectorAll(".overflow-y-auto, .overflow-x-auto, .custom-scrollbar");
      
      elementsToHide.forEach((el) => el.style.removeProperty("display"));
      elementsToShow.forEach((el) => el.style.removeProperty("display"));
      scrollElements.forEach((el) => el.style.removeProperty("overflow"));
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