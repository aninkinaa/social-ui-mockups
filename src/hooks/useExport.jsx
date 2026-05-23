import { toPng, toJpeg } from "html-to-image";

export function useExport() {
  const downloadImage = async (ref, format = "png", filename = "export") => {
    if (!ref.current) return;
    const elementsToHide = ref.current.querySelectorAll(".export-hide");
    const elementsToShow = ref.current.querySelectorAll(".export-show");
    const scrollElements = ref.current.querySelectorAll(".overflow-y-auto, .overflow-x-auto, .custom-scrollbar");

    elementsToHide.forEach((el) => el.style.setProperty("display", "none", "important"));
    elementsToShow.forEach((el) => el.style.setProperty("display", "flex", "important"));

    elementsToHide.forEach((el) => el.style.setProperty("display", "none", "important"));
    elementsToShow.forEach((el) => el.style.setProperty("display", "flex", "important"));
    scrollElements.forEach((el) => el.style.setProperty("overflow", "hidden", "important"));

    await new Promise((resolve) => setTimeout(resolve, 300));

    const exportWithRatio = async (ratio) => {
      const options = {
        quality: 1.0,
        pixelRatio: ratio,
        useCORS: true,
        skipFonts: false,
        style: {
          borderRadius: "0px",
          boxShadow: "none",
          outline: "none",
          transform: "scale(1)",
          margin: "0",
          WebkitFontSmoothing: "antialiased",
          MozOsxFontSmoothing: "grayscale"
        },
        cacheBust: true,
        filter: (node) => {
          return !node.classList?.contains('export-hide');
        }
      };

      await toPng(ref.current, options).catch(() => { });
      await new Promise((resolve) => setTimeout(resolve, 150));

      return format === "jpg"
        ? await toJpeg(ref.current, options)
        : await toPng(ref.current, options);
    };

    try {
      let dataUrl;
      try {
        dataUrl = await exportWithRatio(3);
      } catch (err1) {
        console.warn("Failed to export with pixelRatio 3, trying pixelRatio 2...");
        try {
          dataUrl = await exportWithRatio(2);
        } catch (err2) {
          console.warn("Failed to export with pixelRatio 2, trying pixelRatio 1...");
          dataUrl = await exportWithRatio(1);
        }
      }

      if (!dataUrl || dataUrl === 'data:,') {
        throw new Error("Failed to generate image. The output was empty.");
      }

      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.download = `${filename}.${format}`;
      link.href = blobUrl;
      link.click();

      setTimeout(() => {
        window.URL.revokeObjectURL(blobUrl);
      }, 1000);

    } catch (error) {
      console.dir(error);
      console.error("Failed to export image:", error?.message || error);
      alert("Your browser may have blocked the export due to memory limits. Try simplifying your design or exporting in smaller parts.");
    } finally {
      elementsToHide.forEach((el) => el.style.removeProperty("display"));
      elementsToHide.forEach((el) => el.style.removeProperty("display"));
      elementsToShow.forEach((el) => el.style.removeProperty("display"));
    }
  };

  return { downloadImage };
}