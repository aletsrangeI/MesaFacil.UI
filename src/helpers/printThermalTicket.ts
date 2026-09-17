/**
 * Utilidad para impresión de tickets térmicos (80mm / PDF / continuo).
 * Imprime a través de un <iframe> aislado para garantizar que el navegador
 * formatee únicamente el contenido del ticket en 1 sola hoja continua,
 * sin arrastrar la estructura, fondos o páginas en blanco del resto de la aplicación.
 */
export function printThermalTicket(element: HTMLElement, title: string = 'Ticket'): void {
  if (!element) return;

  // Crear iframe invisible
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.setAttribute('aria-hidden', 'true');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) {
    // Respaldo de emergencia
    window.print();
    iframe.remove();
    return;
  }

  // Clonar el contenido del ticket
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.display = 'block';

  // Si hay elementos <canvas> (como el código QR de autofacturación),
  // reemplazarlos por <img> con dataURL para que el motor de impresión los renderice fielmente
  const originalCanvases = element.querySelectorAll('canvas');
  const clonedCanvases = clone.querySelectorAll('canvas');
  originalCanvases.forEach((orig, idx) => {
    const dest = clonedCanvases[idx];
    if (dest) {
      try {
        const dataUrl = orig.toDataURL('image/png');
        const img = doc.createElement('img');
        img.src = dataUrl;
        img.style.width = orig.style.width || `${orig.width || 140}px`;
        img.style.height = orig.style.height || `${orig.height || 140}px`;
        img.style.display = 'block';
        img.style.margin = '0 auto';
        dest.parentNode?.replaceChild(img, dest);
      } catch (err) {
        console.warn('[printThermalTicket] No se pudo convertir canvas a imagen:', err);
      }
    }
  });

  const styles = `
    @page {
      size: 80mm auto;
      margin: 0;
    }
    @media print {
      @page {
        size: 80mm auto;
        margin: 0;
      }
      html, body {
        margin: 0 !important;
        padding: 0 !important;
        width: 80mm !important;
      }
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      margin: 0;
      padding: 4mm 3mm;
      font-family: 'Courier New', Courier, monospace, sans-serif;
      font-size: 12px;
      line-height: 1.35;
      color: #000000;
      background: #ffffff;
      width: 76mm;
      max-width: 100%;
    }
    .thermal-ticket-wrapper {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      box-shadow: none !important;
      border: none !important;
      background: #ffffff !important;
      color: #000000 !important;
      font-family: inherit;
    }
    .thermal-ticket-header {
      text-align: center;
      margin-bottom: 8px;
    }
    .thermal-ticket-title {
      font-size: 16px;
      font-weight: bold;
      letter-spacing: 0.5px;
      margin: 0 0 2px 0;
      text-transform: uppercase;
    }
    .thermal-ticket-subtitle {
      font-size: 11px;
      color: #333333;
      margin: 0 0 2px 0;
    }
    .thermal-ticket-badge {
      display: inline-block;
      font-weight: bold;
      font-size: 12px;
      border: 1px dashed #000000;
      padding: 2px 6px;
      margin-top: 4px;
      text-transform: uppercase;
    }
    .thermal-divider {
      border-top: 1px dashed #000000;
      margin: 8px 0;
    }
    .thermal-divider-double {
      border-top: 2px double #000000;
      margin: 8px 0;
    }
    .thermal-meta-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      margin-bottom: 2px;
    }
    .thermal-items-table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0;
      font-size: 11px;
    }
    .thermal-items-table th {
      border-bottom: 1px dashed #000000;
      padding: 3px 0;
      text-align: left;
      font-weight: bold;
    }
    .thermal-items-table td {
      padding: 3px 0;
      vertical-align: top;
    }
    .thermal-row-total {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      margin-bottom: 3px;
    }
    .thermal-grand-total {
      font-size: 15px;
      font-weight: bold;
    }
    .thermal-tip-section {
      background-color: #f4f4f4;
      border: 1px dashed #000000;
      padding: 6px 8px;
      margin: 8px 0;
      border-radius: 4px;
    }
    .thermal-tip-row {
      display: flex;
      justify-content: space-between;
      font-size: 11px;
      margin-bottom: 2px;
    }
    .thermal-signature-line {
      margin-top: 22px;
      border-top: 1px solid #000000;
      text-align: center;
      font-size: 10px;
      padding-top: 3px;
    }
    .thermal-footer {
      text-align: center;
      font-size: 10px;
      margin-top: 10px;
      color: #333333;
    }
  `;

  doc.open();
  doc.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>${styles}</style>
</head>
<body>
  ${clone.outerHTML}
</body>
</html>`);
  doc.close();

  // Dejar que los recursos del iframe (fuentes, imágenes convertidas) se estabilicen
  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (err) {
      console.error('[printThermalTicket] Error al invocar print:', err);
    } finally {
      // Limpiar iframe después de cerrar el diálogo
      setTimeout(() => {
        iframe.remove();
      }, 1500);
    }
  }, 200);
}
