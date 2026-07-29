"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMyBusiness, deleteService } from "@/lib/api/admin";
import { getServicesByBusiness } from "@/lib/api/public";
import { Service } from "@/lib/types";
import { ServiceFormDialog } from "@/components/admin/service-form-dialog";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function load() {
      const business = await getMyBusiness();
      if (!business) {
        setIsLoading(false);
        return;
      }
      setBusinessId(business.id);
      const data = await getServicesByBusiness(business.id);
      setServices(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleAddNew = () => {
    setEditingService(null);
    setFormOpen(true);
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormOpen(true);
  };

  const handleSaved = (saved: Service) => {
    setServices((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      return exists ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteService(deleteTarget.id);
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.success("Service deleted");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete service. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <p className="text-[14px] text-[#5C7377]">Loading…</p>;
  }

  if (!businessId) {
    return (
      <p className="text-[14px] text-[#5C7377]">
        You need to set up your business profile first. Go to{" "}
        <a href="/admin/business" className="font-medium text-[#1F6E71] underline-offset-4 hover:underline">
          Business info
        </a>
        .
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1
            className="text-[24px] leading-tight text-[#14262A]"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600 }}
          >
            Services
          </h1>
          <p className="mt-1 text-[14px] text-[#5C7377]">
            Manage the services your business offers
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-[#1F6E71] px-4 text-[14px] font-medium text-white transition hover:bg-[#175457]"
        >
          <Plus className="h-4 w-4" />
          Add service
        </button>
      </div>

      {services.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE8E7] bg-white py-12 text-center">
          <p className="text-[14px] text-[#9AAAAD]">No services yet. Add your first one.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#DCE8E7] bg-white">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#DCE8E7]">
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Name
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Price
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Duration
                </th>
                <th className="px-5 py-3 text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-[12px] font-medium uppercase tracking-[0.08em] text-[#5C7377]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-[#DCE8E7] last:border-0 hover:bg-[#F5F8F8]"
                >
                  <td className="px-5 py-3.5 text-[14px] font-medium text-[#14262A]">
                    {service.name}
                  </td>
                  <td className="px-5 py-3.5 text-[14px] text-[#5C7377]">
                    ${service.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-[14px] text-[#5C7377]">
                    {service.durationMinutes} min
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={
                        service.isActive
                          ? "inline-flex items-center rounded-full bg-[#1F6E71]/10 px-2.5 py-0.5 text-[12px] font-medium text-[#1F6E71]"
                          : "inline-flex items-center rounded-full bg-[#DCE8E7] px-2.5 py-0.5 text-[12px] font-medium text-[#5C7377]"
                      }
                    >
                      {service.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleEdit(service)}
                      className="rounded-md p-1.5 text-[#5C7377] transition hover:bg-[#1F6E71]/10 hover:text-[#1F6E71]"
                      aria-label={`Edit ${service.name}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteTarget(service)}
                      className="rounded-md p-1.5 text-[#B54634] transition hover:bg-[#B54634]/10"
                      aria-label={`Delete ${service.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ServiceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        service={editingService}
        onSaved={handleSaved}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.name || ""}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}