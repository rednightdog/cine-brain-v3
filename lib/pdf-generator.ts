// @ts-ignore
import PDFDocument from 'pdfkit/js/pdfkit.standalone';
import blobStream from 'blob-stream';

export type PDFItem = {
    name: string;
    level: number; // 0 for root, 1+ for children
};

export type ProjectData = {
    name: string;
    productionCo?: string | null;
    producer?: string | null;
    director?: string | null;
    cinematographer?: string | null;
    assistantCamera?: string | null;
    rentalHouse?: string | null;
    contactsJson?: string | null;
    datesJson?: string | null;
    version?: number;
};

export async function generateCineListPDF(data: PDFItem[], project: ProjectData | null): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const doc = new PDFDocument({ margin: 40, size: 'A4' });
            const stream = doc.pipe(blobStream());

            // --- LAYOUT CONSTANTS ---
            const LEFT_MARGIN = 40;
            const RIGHT_MARGIN = 550; // A4 width is ~595. 595 - 40 = 555.
            const CONTENT_WIDTH = RIGHT_MARGIN - LEFT_MARGIN; // ~510

            // --- HEADER ---
            let currentY = 40;

            // Top Status Bar (Document Type & Generator)
            doc.fontSize(8).font('Helvetica').fillColor('#8E8E93');
            doc.text(`CINEBRAIN • CAMERA REPORT • V${project?.version || 1}`, LEFT_MARGIN, currentY, { characterSpacing: 1 });

            doc.text('CAMERA ORDER', LEFT_MARGIN, currentY, { align: 'right', width: CONTENT_WIDTH, characterSpacing: 1 });

            currentY += 25; // Spacing after minimal header

            // Parse Dates
            let shootDates = "TBD";
            if (project?.datesJson) {
                try {
                    const d = JSON.parse(project.datesJson);
                    if (d.shoot?.start) shootDates = `${d.shoot.start} — ${d.shoot.end || '...'}`;
                } catch (e) { }
            }

            // Define Metadata Fields
            // Project Name is included here as requested
            const metaFields = [
                { label: "PROJECT", value: project?.name },
                { label: "PRODUCTION", value: project?.productionCo },
                { label: "RENTAL", value: project?.rentalHouse },
                { label: "DP", value: project?.cinematographer },
                { label: "1ST AC", value: project?.assistantCamera },
                { label: "DATES", value: shootDates },
            ];

            // Render grid
            // Uniform Style: Label (Thin Grey) ..... Value (Medium Grey, Normal)

            doc.fontSize(9);
            const LABEL_WIDTH = 80;
            const VALUE_X = LEFT_MARGIN + LABEL_WIDTH;

            metaFields.forEach(field => {
                if (!field.value) return; // Skip empty rows

                const rowH = Math.max(
                    doc.heightOfString(field.label, { width: LABEL_WIDTH }),
                    doc.heightOfString(field.value, { width: 330 })
                );

                // Label
                doc.font('Helvetica').fillColor('#8E8E93').text(field.label, LEFT_MARGIN, currentY, { width: LABEL_WIDTH });

                // Value (Medium Grey #555555)
                doc.font('Helvetica').fillColor('#555555').text(field.value, VALUE_X, currentY, { width: 330 });

                currentY += rowH + 8; // Slightly more spacious
            });

            // --- SEPARATOR ---
            currentY += 15;
            doc.moveTo(LEFT_MARGIN, currentY).lineTo(RIGHT_MARGIN, currentY).strokeColor('#E5E5EA').lineWidth(0.5).stroke();
            currentY += 20;

            // --- EQUIPMENT LIST ---
            doc.y = currentY;

            doc.fontSize(8).font('Helvetica').fillColor('#8E8E93').text('EQUIPMENT INVENTORY', LEFT_MARGIN, doc.y, { characterSpacing: 1 });
            doc.moveDown(1.5);

            // List Logic
            data.forEach(item => {
                // Check pagination
                if (doc.y > 750) {
                    doc.addPage();
                    currentY = 40;
                    doc.y = currentY;
                }

                if (item.level === 0) {
                    // Main Item
                    doc.moveDown(0.2);

                    const yPos = doc.y;

                    // Standardize Item Name - #555555
                    doc.fontSize(10).font('Helvetica').fillColor('#555555')
                        .text(item.name, LEFT_MARGIN, yPos);

                    doc.moveTo(LEFT_MARGIN, doc.y).lineTo(RIGHT_MARGIN, doc.y).strokeColor('#F2F2F7').lineWidth(0.5).stroke();
                    doc.moveDown(0.4);

                } else {
                    // Child Item
                    doc.fontSize(9).font('Helvetica').fillColor('#555555') // Changed from #777777 to #555555
                        .text(item.name, LEFT_MARGIN + 15, doc.y);
                }
            });

            // End Document
            doc.end();

            stream.on('finish', function () {
                const blob = stream.toBlob('application/pdf');
                const url = URL.createObjectURL(blob);
                resolve(url);
            });

            stream.on('error', (err) => reject(err));

        } catch (error) {
            reject(error);
        }
    });
}
