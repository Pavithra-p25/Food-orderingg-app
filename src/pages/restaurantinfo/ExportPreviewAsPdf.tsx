import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { getToday } from "../../utils/export/ExportData";

 export const ExportPreviewAsPdf = async (
    previewRef: React.RefObject<HTMLDivElement | null>,
    fileName: string,
  ) => {
    if (!previewRef.current) return;

    const clonedElement = previewRef.current.cloneNode(true) as HTMLElement;

    clonedElement.style.position = "absolute";
    clonedElement.style.top = "-9999px";
    clonedElement.style.left = "-9999px";
    clonedElement.style.display = "block";
    clonedElement.style.width = previewRef.current.offsetWidth + "px";

    // Show PDF-only elements
    clonedElement.querySelectorAll(".pdf-only").forEach((el) => {
      (el as HTMLElement).style.display = "block";
    });

    // Hide buttons
    clonedElement.querySelectorAll(".no-print").forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    document.body.appendChild(clonedElement);

    const canvas = await html2canvas(clonedElement, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,
    });

    document.body.removeChild(clonedElement);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName}-${getToday()}.pdf`);
  };
