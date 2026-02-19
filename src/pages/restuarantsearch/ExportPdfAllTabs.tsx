import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPdfAllTabs = (
  allTabs: { name: string; data: any[] }[],
  options?: { orientation?: "portrait" | "landscape" }
) => {
  const doc = new jsPDF({
    orientation: options?.orientation || "portrait",
  });

  let globalPageNumber = 1; // Track page number across all tabs

  allTabs.forEach((tab, tabIndex) => {
    if (tabIndex > 0) doc.addPage();

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Tab name (centered at top)
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(tab.name, pageWidth / 2, 15, { align: "center" });

    autoTable(doc, {
      startY: 25,
      head: [Object.keys(tab.data[0] || {})],
      body: tab.data.map((row) => Object.values(row)),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [25, 118, 210] },

      didDrawPage: () => {
        // Page number centered at bottom
        doc.setFontSize(10);
        doc.text(`${globalPageNumber}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });

        globalPageNumber++;
      },
    });
  });

  // Save file with RestaurantsPDF name
  doc.save("RestaurantsPDF.pdf");
};
