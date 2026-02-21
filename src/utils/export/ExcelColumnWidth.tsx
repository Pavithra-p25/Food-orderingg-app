export const setAutoColumnWidth = (data: any[][]) => {
  const colCount = Math.max(...data.map((row) => row.length));

  return Array.from({ length: colCount }).map((_, colIndex) => {
    const maxLength = Math.max(
      10,
      ...data.map((row) =>
        row[colIndex] ? String(row[colIndex]).length : 0,
      ),
    );

    return { wch: maxLength + 2 };
  });
};