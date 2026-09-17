import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, X } from 'lucide-react';
import { useGenerarCuentaMutation } from './PaymentModal';
import { printThermalTicket } from '../../../helpers/printThermalTicket';
import './pos.css';

interface ThermalTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  idPedido: string | null;
  tipo: 'pre-cuenta' | 'ticket-final';
  // En caso de que ya tengamos la cuenta cargada (ej. desde PaymentModal)
  cuentaData?: any;
}

export const ThermalTicketModal: React.FC<ThermalTicketModalProps> = ({
  isOpen,
  onClose,
  idPedido,
  tipo,
  cuentaData
}) => {
  const [generarCuenta, { data: fetchedRes, isLoading }] = useGenerarCuentaMutation();
  const ticketRef = useRef<HTMLDivElement>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && idPedido && !cuentaData) {
      generarCuenta(idPedido);
    }
  }, [isOpen, idPedido, cuentaData, generarCuenta]);

  const cuenta = cuentaData || (fetchedRes as any)?.data;

  // Guid del pedido para el QR de autofacturación (spec 020). `idPedido` y
  // `cuenta.idPedido` ya son string (Guid) tras la migración de spec 019.
  const pedidoGuid: string | null = idPedido || cuenta?.idPedido || null;
  const codigoFacturacion = pedidoGuid ? pedidoGuid.replace(/-/g, '').slice(0, 8).toUpperCase() : '';
  const urlAutofactura = pedidoGuid ? `https://app.mesafacil.mx/facturar?ticket=${pedidoGuid}` : '';

  useEffect(() => {
    if (!isOpen || tipo !== 'ticket-final' || !pedidoGuid) return;
    const canvas = qrCanvasRef.current;
    if (!canvas) return;
    setQrError(null);
    QRCode.toCanvas(canvas, urlAutofactura, {
      width: 140,
      margin: 1,
      color: { dark: '#1e293b', light: '#ffffff' },
    }).catch(() => setQrError('No se pudo generar el código QR de facturación.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, tipo, pedidoGuid, urlAutofactura, cuenta]);

  if (!isOpen) return null;

  const handlePrint = () => {
    if (ticketRef.current) {
      printThermalTicket(ticketRef.current, tipo === 'pre-cuenta' ? 'Pre-cuenta' : 'Ticket de Pago');
    } else {
      window.print();
    }
  };

  const fechaFormateada = new Date().toLocaleString('es-MX', {
    dateStyle: 'short',
    timeStyle: 'short'
  });

  return (
    <div className="pos-modal-overlay">
      <div 
        className="pos-modal-content"
        style={{
          width: '95%',
          maxWidth: 460,
          background: '#f8fafc',
          borderRadius: 16,
          padding: 0,
          overflow: 'hidden'
        }}
      >
        {/* Header (No print) */}
        <div 
          className="no-print"
          style={{
            padding: '16px 20px',
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Printer size={20} color="#3b82f6" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>
              {tipo === 'pre-cuenta' ? 'Vista Previa: Pre-cuenta' : 'Vista Previa: Ticket de Pago'}
            </h3>
          </div>
          <button 
            onClick={onClose}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#64748b' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body / Thermal Ticket Preview */}
        <div style={{ padding: '20px', maxHeight: '72vh', overflowY: 'auto' }}>
          {isLoading && !cuenta ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
              Cargando datos del ticket...
            </div>
          ) : !cuenta ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#ef4444' }}>
              No se pudo obtener la información de la cuenta.
            </div>
          ) : (
            <div ref={ticketRef} className="thermal-ticket-wrapper">
              {/* Encabezado del ticket */}
              <div className="thermal-ticket-header">
                <div className="thermal-ticket-title">MESAFACIL REST</div>
                <div className="thermal-ticket-subtitle">
                  {cuenta.sucursalNombre || 'Sucursal Principal'}
                </div>
                <div className="thermal-ticket-subtitle">RFC: MES-240101-ABC</div>
                <div className="thermal-ticket-badge">
                  {tipo === 'pre-cuenta' ? '*** PRE-CUENTA ***' : '*** RECIBO DE PAGO ***'}
                </div>
              </div>

              <div className="thermal-divider" />

              {/* Metadatos */}
              <div className="thermal-meta-row">
                <span>Folio Pedido: #{idPedido || cuenta.idPedido}</span>
                <span>Cuenta: #{cuenta.id}</span>
              </div>
              <div className="thermal-meta-row">
                <span>Mesa: {cuenta.mesaNombre || 'Barra'}</span>
                <span>Fecha: {fechaFormateada}</span>
              </div>

              <div className="thermal-divider" />

              {/* Tabla de ítems consumidos */}
              <table className="thermal-items-table">
                <thead>
                  <tr>
                    <th style={{ width: '12%' }}>Cant</th>
                    <th style={{ width: '56%' }}>Descripción</th>
                    <th style={{ width: '32%', textAlign: 'right' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {cuenta.items && cuenta.items.length > 0 ? (
                    cuenta.items.map((it: any, idx: number) => (
                      <React.Fragment key={idx}>
                        <tr>
                          <td>{it.cantidad}</td>
                          <td>
                            <strong>{it.productoNombre}</strong>
                            {it.varianteNombre && (
                              <div style={{ fontSize: '11px', color: '#4b5563' }}>
                                ({it.varianteNombre})
                              </div>
                            )}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            ${(it.cantidad * it.precioUnitario).toFixed(2)}
                          </td>
                        </tr>
                        {it.modificadores && it.modificadores.map((m: string, mIdx: number) => (
                          <tr key={`mod-${idx}-${mIdx}`} style={{ fontSize: '11px', color: '#6b7280' }}>
                            <td></td>
                            <td colSpan={2}> + {m}</td>
                          </tr>
                        ))}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} style={{ textAlign: 'center', padding: '8px' }}>
                        Consumo general
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="thermal-divider" />

              {/* Totales */}
              <div className="thermal-row-total">
                <span>Subtotal:</span>
                <span>${cuenta.subtotal?.toFixed(2)}</span>
              </div>
              <div className="thermal-row-total">
                <span>IVA (16%):</span>
                <span>${cuenta.impuestoTotal?.toFixed(2)}</span>
              </div>

              <div className="thermal-divider-double" />

              <div className="thermal-row-total thermal-grand-total">
                <span>TOTAL:</span>
                <span>${cuenta.total?.toFixed(2)}</span>
              </div>

              {/* Secci�n Condicional: Pre-cuenta con sugerencia de propinas */}
              {tipo === 'pre-cuenta' && (
                <div className="thermal-tip-section">
                  <div style={{ fontWeight: 'bold', textAlign: 'center', marginBottom: 6, fontSize: '11px' }}>
                    PROPINA SUGERIDA (Opcional)
                  </div>
                  <div className="thermal-tip-row">
                    <span>10% (${((cuenta.total * 0.10)).toFixed(2)}):</span>
                    <span>Total: ${(cuenta.total * 1.10).toFixed(2)}</span>
                  </div>
                  <div className="thermal-tip-row">
                    <span>15% (${((cuenta.total * 0.15)).toFixed(2)}):</span>
                    <span>Total: ${(cuenta.total * 1.15).toFixed(2)}</span>
                  </div>
                  <div className="thermal-tip-row">
                    <span>20% (${((cuenta.total * 0.20)).toFixed(2)}):</span>
                    <span>Total: ${(cuenta.total * 1.20).toFixed(2)}</span>
                  </div>
                  <div className="thermal-signature-line">
                    Propina aportada: $________  Firma: ______________
                  </div>
                </div>
              )}

              {/* Secci�n Condicional: Ticket Final con Pagos Realizados */}
              {tipo === 'ticket-final' && (
                <div>
                  <div className="thermal-divider" />
                  <div style={{ fontWeight: 'bold', fontSize: '12px', marginBottom: 4 }}>
                    PAGOS RECIBIDOS
                  </div>
                  {cuenta.pagosRealizados && cuenta.pagosRealizados.length > 0 ? (
                    cuenta.pagosRealizados.map((pago: any) => (
                      <div key={pago.id} style={{ fontSize: '12px', marginBottom: 2 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>{pago.metodoDePago || 'Pago'}:</span>
                          <span>${pago.monto?.toFixed(2)}</span>
                        </div>
                        {pago.propina > 0 && (
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#4b5563', paddingLeft: 8 }}>
                            <span>Propina:</span>
                            <span>${pago.propina?.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span>Total Liquidado:</span>
                      <span>${cuenta.total?.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="thermal-divider" />

                  {/* Autofacturación QR (spec 020) */}
                  {pedidoGuid && (
                    <div style={{ textAlign: 'center', padding: '4px 0 8px' }}>
                      <div style={{ fontWeight: 'bold', fontSize: '11px', marginBottom: 6 }}>
                        FACTURA TU CONSUMO
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <canvas ref={qrCanvasRef} width={140} height={140} />
                      </div>
                      {qrError && (
                        <div style={{ fontSize: '10px', color: '#dc2626', marginTop: 4 }}>{qrError}</div>
                      )}
                      <div style={{ fontSize: '11px', marginTop: 6 }}>
                        Escanea el QR o entra a app.mesafacil.mx/facturar
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 'bold', marginTop: 4, letterSpacing: '1px' }}>
                        Código: {codigoFacturacion}
                      </div>
                      <div style={{ fontSize: '10px', color: '#4b5563' }}>
                        Vigencia: hasta el último día del mes en curso
                      </div>
                    </div>
                  )}

                  <div className="thermal-divider" />
                  <div className="thermal-footer">
                    <div>¡GRACIAS POR SU PREFERENCIA!</div>
                    <div>Este comprobante no es deducible de impuestos</div>
                    <div>Solicite su factura en caja o vía web</div>
                  </div>
                </div>
              )}

              {tipo === 'pre-cuenta' && (
                <div className="thermal-footer">
                  <div>Por favor verifique sus consumos antes de pagar</div>
                  <div>¡Gracias por su visita!</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions Footer (No print) */}
        <div 
          className="no-print"
          style={{
            padding: '16px 20px',
            background: '#ffffff',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            gap: 12,
            justifyContent: 'flex-end'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#475569',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            Cerrar
          </button>
          <button
            onClick={handlePrint}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: '#10b981',
              color: '#ffffff',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Printer size={18} />
            Imprimir Ticket (80mm / PDF)
          </button>
        </div>
      </div>
    </div>
  );
};
