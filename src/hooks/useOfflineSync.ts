import { useEffect, useRef } from "react";
import { useNetworkStatus } from "./useNetworkStatus";
import { useToast } from "../components/ui/toast";

/**
 * Hook que monitorea la conectividad de red y el estado del backend.
 * Cuando el dispositivo pasa de offline a online/local:
 * 1. Drena y envía las comandas/pedidos pendientes en 'mf_offline_pending_orders'.
 * 2. Drena y envía las solicitudes de cuenta pendientes en 'mf_offline_cuenta_requests'.
 * 3. Drena y envía las liberaciones de mesas en 'mf_offline_table_releases'.
 */
export function useOfflineSync() {
  const status = useNetworkStatus();
  const { addToast } = useToast();
  const isSyncingRef = useRef(false);

  useEffect(() => {
    // Solo sincronizar si tenemos conexión al backend local o WAN
    if (status === "offline") return;
    if (isSyncingRef.current) return;

    const syncPendingData = async () => {
      isSyncingRef.current = true;
      try {
        let authObj: any = null;
        try {
          const rawAuth = localStorage.getItem("mf_auth");
          if (rawAuth) authObj = JSON.parse(rawAuth);
        } catch {
          // Ignorado
        }

        const token = authObj?.accessToken || authObj?.token;
        const headers: Record<string, string> = {
          "Content-Type": "application/json",
        };
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // 1. Sincronizar pedidos / comandas pendientes
        const rawOrders = localStorage.getItem("mf_offline_pending_orders");
        if (rawOrders) {
          const orders: any[] = JSON.parse(rawOrders);
          if (orders.length > 0) {
            const remainingOrders: any[] = [];
            for (const order of orders) {
              try {
                const response = await fetch("/api/Pedidos/InsertConDetallesAsync", {
                  method: "POST",
                  headers,
                  body: JSON.stringify({
                    idEmpresa: order.idEmpresa,
                    idSucursal: order.idSucursal,
                    idMesa: order.idMesa,
                    idTipoPedido: order.idTipoPedido,
                    idEstadoPedido: order.idEstadoPedido,
                    personas: order.personas || 1,
                    cargoServicioPct: order.cargoServicioPct || 0,
                    idempotencyKey: order.idempotencyKey,
                    canalOrigen: order.canalOrigen || "ComanderoMovil",
                    idExterno: order.idExterno || null,
                    nombreClienteDelivery: order.nombreClienteDelivery || null,
                    telefonoDelivery: order.telefonoDelivery || null,
                    direccionEntrega: order.direccionEntrega || null,
                    detalles: order.detalles || [],
                  }),
                });

                if (response.ok) {
                  const data = await response.json();
                  const pedidoId = data?.data || "";
                  const mesaLabel = order.mesaCodigo ? ` (Mesa ${order.mesaCodigo})` : "";
                  addToast({
                    message: `¡Comanda offline sincronizada exitosamente con cocina y KDS! #${pedidoId}${mesaLabel}`,
                    variant: "success",
                  });
                } else if (response.status === 409) {
                  // Conflicto de concurrencia (mesa ocupada por otro o ya procesada)
                  console.warn("[OfflineSync] Conflicto 409 al sincronizar pedido:", order);
                } else {
                  // Error temporal de servidor, conservar para reintentar luego
                  remainingOrders.push(order);
                }
              } catch (e) {
                console.warn("[OfflineSync] Error de red al enviar pedido offline:", e);
                remainingOrders.push(order);
              }
            }

            if (remainingOrders.length > 0) {
              localStorage.setItem("mf_offline_pending_orders", JSON.stringify(remainingOrders));
            } else {
              localStorage.removeItem("mf_offline_pending_orders");
            }
          }
        }

        // 2. Sincronizar solicitudes de cuenta pendientes
        const rawCuentas = localStorage.getItem("mf_offline_cuenta_requests");
        if (rawCuentas) {
          const cuentas: any[] = JSON.parse(rawCuentas);
          if (cuentas.length > 0) {
            const remainingCuentas: any[] = [];
            for (const item of cuentas) {
              try {
                const response = await fetch("/api/Mesas/UpdateAsync", {
                  method: "PUT",
                  headers,
                  body: JSON.stringify({
                    id: item.idMesa,
                    idEstadoMesa: item.idEstadoMesa || 91,
                  }),
                });
                if (response.ok) {
                  addToast({
                    message: `Cuenta para mesa ${item.idMesa} sincronizada con caja`,
                    variant: "success",
                  });
                } else {
                  remainingCuentas.push(item);
                }
              } catch {
                remainingCuentas.push(item);
              }
            }
            if (remainingCuentas.length > 0) {
              localStorage.setItem("mf_offline_cuenta_requests", JSON.stringify(remainingCuentas));
            } else {
              localStorage.removeItem("mf_offline_cuenta_requests");
            }
          }
        }

        // 3. Sincronizar liberaciones de mesas pendientes
        const rawReleases = localStorage.getItem("mf_offline_table_releases");
        if (rawReleases) {
          const releases: any[] = JSON.parse(rawReleases);
          if (releases.length > 0) {
            const remainingReleases: any[] = [];
            for (const item of releases) {
              try {
                const response = await fetch("/api/Mesas/UpdateAsync", {
                  method: "PUT",
                  headers,
                  body: JSON.stringify({
                    id: item.idMesa,
                    idEstadoMesa: item.idEstadoMesa || 1,
                  }),
                });
                if (response.ok) {
                  addToast({
                    message: `Mesa ${item.idMesa} liberada y sincronizada`,
                    variant: "success",
                  });
                } else {
                  remainingReleases.push(item);
                }
              } catch {
                remainingReleases.push(item);
              }
            }
            if (remainingReleases.length > 0) {
              localStorage.setItem("mf_offline_table_releases", JSON.stringify(remainingReleases));
            } else {
              localStorage.removeItem("mf_offline_table_releases");
            }
          }
        }
      } catch (err) {
        console.warn("[OfflineSync] Error general en el proceso de sincronización:", err);
      } finally {
        isSyncingRef.current = false;
      }
    };

    syncPendingData();
  }, [status, addToast]);
}
