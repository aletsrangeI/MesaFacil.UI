import { useState, useEffect, useMemo } from 'react';
import { Link2, Unlink2, X, Check, Users, AlertCircle } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';
import { useUnirMesasMutation, useDesunirGrupoMutation } from '../../../services/mesasApi';

interface UnirMesasModalProps {
  isOpen: boolean;
  onClose: () => void;
  mesaPrincipal: any;
  todasMesas: any[];
  areas?: any[];
  onSuccess?: () => void;
}

export function UnirMesasModal({
  isOpen,
  onClose,
  mesaPrincipal,
  todasMesas,
  areas = [],
  onSuccess,
}: UnirMesasModalProps) {
  const { addToast } = useToast();
  const [unirMesas, { isLoading: isUniendo }] = useUnirMesasMutation();
  const [desunirGrupo, { isLoading: isDesuniendo }] = useDesunirGrupoMutation();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Initialize selected secondary tables from mesaPrincipal
  useEffect(() => {
    if (!mesaPrincipal) {
      setSelectedIds([]);
      return;
    }
    const initialIds: number[] = [];
    if (Array.isArray(mesaPrincipal.idsMesasUnidas)) {
      initialIds.push(...mesaPrincipal.idsMesasUnidas);
    }
    // Also include tables in todasMesas that have idMesaPrincipal === mesaPrincipal.id
    for (const m of todasMesas) {
      if (m.idMesaPrincipal === mesaPrincipal.id && !initialIds.includes(m.id)) {
        initialIds.push(m.id);
      }
    }
    setSelectedIds(initialIds);
  }, [mesaPrincipal, todasMesas]);

  // Candidates: tables in the same sucursal and same area (or general), excluding the mesa itself
  const candidateMesas = useMemo(() => {
    if (!mesaPrincipal) return [];
    return todasMesas.filter((m) => {
      if (m.id === mesaPrincipal.id) return false;
      // Filter by same sucursal if present
      if (mesaPrincipal.idSucursal && m.idSucursal && m.idSucursal !== mesaPrincipal.idSucursal) {
        return false;
      }
      // If area exists on both, preferably same area or show all
      if (mesaPrincipal.idArea && m.idArea && m.idArea !== mesaPrincipal.idArea) {
        return false;
      }
      return true;
    });
  }, [mesaPrincipal, todasMesas]);

  // Calculate total capacity
  const totalAsientos = useMemo(() => {
    if (!mesaPrincipal) return 0;
    const baseAsientos = mesaPrincipal.asientos || 2;
    const extraAsientos = candidateMesas
      .filter((m) => selectedIds.includes(m.id))
      .reduce((acc, m) => acc + (m.asientos || 2), 0);
    return baseAsientos + extraAsientos;
  }, [mesaPrincipal, candidateMesas, selectedIds]);

  if (!isOpen || !mesaPrincipal) return null;

  const toggleSelectMesa = (mesaId: number, isJoinedToOther: boolean) => {
    if (isJoinedToOther) return;
    setSelectedIds((prev) =>
      prev.includes(mesaId) ? prev.filter((id) => id !== mesaId) : [...prev, mesaId]
    );
  };

  const handleGuardarUnion = async () => {
    try {
      if (selectedIds.length === 0) {
        // If user unselected all and pressed save, desunir grupo
        if (mesaPrincipal.idsMesasUnidas?.length > 0) {
          await handleDesunirGrupo();
          return;
        }
        addToast({ message: 'Selecciona al menos una mesa secundaria para unir.', variant: 'info' });
        return;
      }

      const res = await unirMesas({
        idMesaPrincipal: mesaPrincipal.id,
        idsMesasSecundarias: selectedIds,
      }).unwrap();

      if (res.isSuccess) {
        addToast({
          message: `Mesas unidas correctamente a Mesa ${mesaPrincipal.codigo || mesaPrincipal.id}. Capacidad total: ${totalAsientos} personas.`,
          variant: 'success',
        });
        if (onSuccess) onSuccess();
        onClose();
      } else {
        addToast({ message: res.message || 'Error al unir mesas.', variant: 'error' });
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || err?.message || 'Error de conexión al unir mesas.',
        variant: 'error',
      });
    }
  };

  const handleDesunirGrupo = async () => {
    try {
      const res = await desunirGrupo(mesaPrincipal.id).unwrap();
      if (res.isSuccess) {
        addToast({
          message: `Se separaron todas las mesas unidas a Mesa ${mesaPrincipal.codigo || mesaPrincipal.id}.`,
          variant: 'success',
        });
        setSelectedIds([]);
        if (onSuccess) onSuccess();
        onClose();
      } else {
        addToast({ message: res.message || 'Error al separar mesas.', variant: 'error' });
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || err?.message || 'Error de conexión al separar mesas.',
        variant: 'error',
      });
    }
  };

  const yaTieneMesasUnidas = (mesaPrincipal.idsMesasUnidas && mesaPrincipal.idsMesasUnidas.length > 0) || selectedIds.length > 0;
  const areaName = areas.find((a) => a.id === mesaPrincipal.idArea)?.nombre || '';

  return (
    <div className="pos-modal-overlay" style={{ zIndex: 1100 }}>
      <div
        className="pos-modal-content"
        style={{
          width: '95%',
          maxWidth: 580,
          padding: 0,
          overflow: 'hidden',
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Link2 size={22} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a', fontWeight: 700 }}>
                Juntar Mesas con Mesa {mesaPrincipal.codigo || mesaPrincipal.id}
              </h2>
              <span style={{ fontSize: 13, color: '#64748b' }}>
                {areaName ? `Área: ${areaName} • ` : ''}Base: {mesaPrincipal.asientos || 2} personas
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#64748b',
              padding: 4,
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', maxHeight: '60vh' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '12px 16px',
              borderRadius: 12,
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
            <div>
              Al unir mesas, compartirán la misma orden y ticket en POS, KDS y Comandero. Se liberarán juntas automáticamente al cobrar la cuenta.
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>
              Mesas disponibles en el área ({candidateMesas.length}):
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '4px 12px',
                borderRadius: 20,
                background: '#f1f5f9',
                color: '#0f172a',
                fontSize: 13,
                fontWeight: 700,
              }}
            >
              <Users size={15} color="#2563eb" />
              Capacidad total: <strong style={{ color: '#2563eb' }}>{totalAsientos} personas</strong>
            </div>
          </div>

          {candidateMesas.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#94a3b8', fontSize: 14 }}>
              No hay otras mesas en esta área para unir.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 10,
              }}
            >
              {candidateMesas.map((mesa) => {
                const isSelected = selectedIds.includes(mesa.id);
                const isJoinedToOther = !!mesa.idMesaPrincipal && mesa.idMesaPrincipal !== mesaPrincipal.id;
                const isOcupada = mesa.idEstadoMesa === 2 || mesa.idEstadoMesa === 4;

                let badgeText = `${mesa.asientos || 2} pax`;
                if (isJoinedToOther) {
                  badgeText = `Unida a M${mesa.codigoMesaPrincipal || mesa.idMesaPrincipal}`;
                } else if (isOcupada && !isSelected) {
                  badgeText = 'Ocupada';
                }

                return (
                  <button
                    key={mesa.id}
                    type="button"
                    disabled={isJoinedToOther}
                    onClick={() => toggleSelectMesa(mesa.id, isJoinedToOther)}
                    style={{
                      padding: '14px 12px',
                      borderRadius: 14,
                      border: isSelected
                        ? '2px solid #2563eb'
                        : isJoinedToOther
                        ? '1px dashed #cbd5e1'
                        : '1px solid #e2e8f0',
                      background: isSelected
                        ? '#eff6ff'
                        : isJoinedToOther
                        ? '#f8fafc'
                        : '#ffffff',
                      cursor: isJoinedToOther ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 6,
                      position: 'relative',
                      opacity: isJoinedToOther ? 0.6 : 1,
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(37, 99, 235, 0.15)' : 'none',
                    }}
                  >
                    {isSelected && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -6,
                          right: -6,
                          background: '#2563eb',
                          color: '#fff',
                          borderRadius: '50%',
                          width: 20,
                          height: 20,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        }}
                      >
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                    <div style={{ fontWeight: 800, fontSize: '1.25rem', color: isSelected ? '#1d4ed8' : '#1e293b' }}>
                      {mesa.codigo || `M${mesa.id}`}
                    </div>
                    <div
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        color: isSelected ? '#2563eb' : isJoinedToOther ? '#94a3b8' : '#64748b',
                        background: isSelected ? '#dbeafe' : '#f1f5f9',
                        padding: '2px 8px',
                        borderRadius: 8,
                      }}
                    >
                      {badgeText}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#f8fafc',
          }}
        >
          {yaTieneMesasUnidas ? (
            <button
              type="button"
              disabled={isDesuniendo || isUniendo}
              onClick={handleDesunirGrupo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 16px',
                borderRadius: 10,
                border: '1px solid #fca5a5',
                background: '#fff',
                color: '#dc2626',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              <Unlink2 size={16} />
              {isDesuniendo ? 'Separando...' : 'Separar Todas'}
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '9px 16px',
                borderRadius: 10,
                border: '1px solid #cbd5e1',
                background: '#fff',
                color: '#475569',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={isUniendo || isDesuniendo}
              onClick={handleGuardarUnion}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '9px 20px',
                borderRadius: 10,
                border: 'none',
                background: '#2563eb',
                color: '#fff',
                fontWeight: 700,
                fontSize: 13,
                cursor: isUniendo ? 'not-allowed' : 'pointer',
                boxShadow: '0 2px 6px rgba(37, 99, 235, 0.3)',
              }}
            >
              <Check size={16} />
              {isUniendo ? 'Guardando...' : `Confirmar Unión (${selectedIds.length} mesas)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
