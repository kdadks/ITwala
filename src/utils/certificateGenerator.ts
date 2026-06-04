import { jsPDF } from 'jspdf';

export interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string; // ISO date string e.g. "2025-06-04"
  certificateNumber: string;
}

// ── Palette ──────────────────────────────────────────────────────────────────
const NAVY: [number, number, number] = [26, 39, 68];
const GOLD: [number, number, number] = [201, 168, 76];
const GRAY: [number, number, number] = [140, 140, 140];
const DARK_FOOTER: [number, number, number] = [18, 22, 48];
const WHITE: [number, number, number] = [255, 255, 255];
const TEAL: [number, number, number] = [22, 75, 80];

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    const dd = String(d.getUTCDate()).padStart(2, '0');
    const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${dd}/${mm}/${d.getUTCFullYear()}`;
  } catch {
    return iso;
  }
}

/** Browser-only helper — fetches a public image and returns its base64 payload. */
async function fetchImageBase64(publicPath: string): Promise<string | undefined> {
  try {
    const r = await fetch(publicPath);
    if (!r.ok) return undefined;
    const blob = await r.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.includes(',') ? result.split(',')[1] : result);
      };
      reader.onerror = () => resolve(undefined);
      reader.readAsDataURL(blob);
    });
  } catch {
    return undefined;
  }
}

/** Browser-only: loads the IT-WALA logo from the public path. */
export function loadLogoBase64(): Promise<string | undefined> {
  return fetchImageBase64('/images/IT-WALA-logo-96x96.png');
}

/** Browser-only: loads the Kdadks footer logo from the public path. */
export function loadKdadksLogoBase64(): Promise<string | undefined> {
  return fetchImageBase64('/images/kdadks-logo.png');
}

// ── Core PDF builder ──────────────────────────────────────────────────────────
function buildPDF(data: CertificateData, logoBase64?: string, kdadksBase64?: string): jsPDF {
  // Landscape A4: 297 × 210 mm
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  const W = 297;
  const H = 210;
  const CX = W / 2; // 148.5

  // ── White fill ──────────────────────────────────────────────────────────────
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, W, H, 'F');

  // ── Double gold border ───────────────────────────────────────────────────────
  // Outer thick border
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(2.2);
  doc.rect(5, 5, W - 10, H - 10);
  // Inner thin border (3 mm inside the outer)
  doc.setLineWidth(0.5);
  doc.rect(8.5, 8.5, W - 17, H - 17);

  // ── IT-WALA Logo (top-left) ──────────────────────────────────────────────────
  const LOGO_X = 15;
  const LOGO_Y = 15;
  const LOGO_SIZE = 42;

  if (logoBase64) {
    try {
      doc.addImage(
        `data:image/png;base64,${logoBase64}`,
        'PNG',
        LOGO_X,
        LOGO_Y,
        LOGO_SIZE,
        LOGO_SIZE
      );
    } catch {
      renderLogoFallback(doc, LOGO_X, LOGO_Y, LOGO_SIZE);
    }
  } else {
    renderLogoFallback(doc, LOGO_X, LOGO_Y, LOGO_SIZE);
  }

  // ── "CERTIFICATE" heading ────────────────────────────────────────────────────
  // Horizontally centered in the space to the right of the logo
  // Logo right edge = LOGO_X + LOGO_SIZE = 57; right inner border = W - 10 = 287
  // Midpoint = (57 + 287) / 2 ≈ 172
  const HEAD_CX = (LOGO_X + LOGO_SIZE + (W - 10)) / 2; // ≈ 172

  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(42);
  doc.text('CERTIFICATE', HEAD_CX, 37, { align: 'center' });

  // "OF COMPLETION" in gold with letter spacing.
  // jsPDF's align:'center' ignores charSpace when computing the centering offset,
  // so we manually compute the total rendered width and derive the start x.
  doc.setTextColor(...GOLD);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(13.5);
  const OF_CHAR_SP = 2.5;
  const OF_TEXT = 'OF COMPLETION';
  doc.setCharSpace(OF_CHAR_SP);
  const ofNormalW = doc.getTextWidth(OF_TEXT);
  const ofTotalW = ofNormalW + (OF_TEXT.length - 1) * OF_CHAR_SP;
  doc.text(OF_TEXT, HEAD_CX - ofTotalW / 2, 49); // manual left-edge so visual centre = HEAD_CX
  doc.setCharSpace(0);

  // ── Horizontal gold divider (separates header from body) ────────────────────
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.45);
  doc.line(12, 63, W - 12, 63);

  // ── Body text ────────────────────────────────────────────────────────────────

  // "This is to certify that"
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11.5);
  doc.text('This is to certify that', CX, 81, { align: 'center' });

  // ── Student name ──────────────────────────────────────────────────────────────
  const studentName = (data.studentName || 'Student Name').toUpperCase();
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.text(studentName, CX, 96, { align: 'center' });

  // Gold underline — width snaps to text width, capped at 200 mm
  const nameUnderlineW = Math.min(doc.getTextWidth(studentName) + 20, 200);
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.75);
  doc.line(CX - nameUnderlineW / 2, 101, CX + nameUnderlineW / 2, 101);

  // "has successfully completed the course"
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11.5);
  doc.text('has successfully completed the course', CX, 115, { align: 'center' });

  // ── Course name ───────────────────────────────────────────────────────────────
  doc.setTextColor(...NAVY);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  const courseLines = doc.splitTextToSize(data.courseName || 'Course Name', 245) as string[];
  const COURSE_Y = 129;
  doc.text(courseLines, CX, COURSE_Y, { align: 'center' });

  const courseBottomY = COURSE_Y + (courseLines.length - 1) * 8.5;

  // Gold underline — adapts to longest wrapped line
  const longestCourseW = Math.max(...courseLines.map((l: string) => doc.getTextWidth(l)));
  const courseUnderlineW = Math.min(longestCourseW + 20, 230);
  const courseUnderlineY = courseBottomY + 6;
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.75);
  doc.line(
    CX - courseUnderlineW / 2,
    courseUnderlineY,
    CX + courseUnderlineW / 2,
    courseUnderlineY
  );

  // ── Date & Certificate number ─────────────────────────────────────────────────
  const dateY = courseUnderlineY + 14;
  doc.setTextColor(...GRAY);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.text(`Date: ${formatDate(data.completionDate)}`, CX, dateY, { align: 'center' });

  doc.setFontSize(8.5);
  doc.text(`Certificate No: ${data.certificateNumber}`, CX, dateY + 7, {
    align: 'center',
  });

  // ── Signature lines ───────────────────────────────────────────────────────────
  const SIG_Y = 175;
  doc.setDrawColor(...GRAY);
  doc.setLineWidth(0.4);

  // Left — Authorized Signature
  doc.line(42, SIG_Y, 122, SIG_Y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...GRAY);
  doc.text('Authorized Signature', 82, SIG_Y + 6, { align: 'center' });

  // Right — Director
  doc.line(175, SIG_Y, 255, SIG_Y);
  doc.text('Director', 215, SIG_Y + 6, { align: 'center' });

  // ── Dark footer bar ───────────────────────────────────────────────────────────
  const FOOTER_H = 21;
  doc.setFillColor(...DARK_FOOTER);
  doc.rect(0, H - FOOTER_H, W, FOOTER_H, 'F');

  // ── Kdadks logo in footer ────────────────────────────────────────────────
  // The logo PNG has a dark navy background that blends with the footer bar.
  // Height fills the footer inner area; width is calculated from ~1.75:1 ratio.
  const KDADKS_H = FOOTER_H - 4;          // 17 mm
  const KDADKS_W = KDADKS_H * 1.75;       // ≈ 30 mm  (matches image aspect)
  const KDADKS_X = 9;
  const KDADKS_Y = H - FOOTER_H + 2;

  if (kdadksBase64) {
    try {
      doc.addImage(
        `data:image/png;base64,${kdadksBase64}`,
        'PNG',
        KDADKS_X,
        KDADKS_Y,
        KDADKS_W,
        KDADKS_H
      );
    } catch {
      // ignore — footer still has contact info
    }
  }

  // ── IT-WALA contact info (centred in footer) ─────────────────────────────
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...WHITE);
  doc.text(
    'IT-WALA  |  www.it-wala.com  |  support@it-wala.com | www.kdadks.com',
    CX,
    H - 8,
    { align: 'center' }
  );

  return doc;
}

// ── Logo fallback (if PNG not available) ──────────────────────────────────────
function renderLogoFallback(doc: jsPDF, x: number, y: number, size: number) {
  // Dark teal rounded square
  doc.setFillColor(...TEAL);
  doc.roundedRect(x, y, size, size, 4, 4, 'F');
  // Gold circle (lightbulb)
  doc.setFillColor(...GOLD);
  doc.circle(x + size / 2, y + size * 0.42, size * 0.22, 'F');
  // "IT-WALA" text
  doc.setTextColor(...WHITE);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text('IT-WALA', x + size / 2, y + size - 5, { align: 'center' });
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Server-side: returns raw bytes for upload to Supabase Storage.
 * Pass `logoBase64` from `fs.readFileSync(...).toString('base64')`.
 */
export async function generateCertificatePDF(
  data: CertificateData,
  logoBase64?: string,
  kdadksBase64?: string
): Promise<Uint8Array> {
  const doc = buildPDF(data, logoBase64, kdadksBase64);
  return doc.output('arraybuffer') as unknown as Uint8Array;
}

/**
 * Browser-side preview: fetches both logos from public paths, builds PDF,
 * and returns an object URL suitable for an <iframe src="...">.
 * Remember to call URL.revokeObjectURL(url) when the preview is closed.
 */
export async function previewCertificateInBrowser(data: CertificateData): Promise<string> {
  const [logoBase64, kdadksBase64] = await Promise.all([
    loadLogoBase64(),
    loadKdadksLogoBase64(),
  ]);
  const doc = buildPDF(data, logoBase64, kdadksBase64);
  const blob = doc.output('blob');
  return URL.createObjectURL(blob);
}
