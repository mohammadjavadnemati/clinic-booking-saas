"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getMyBusiness, deleteSpecialist } from "@/lib/api/admin";
import { getSpecialistsByBusiness } from "@/lib/api/public";
import { Specialist } from "@/lib/types";
import { SpecialistFormDialog } from "@/components/admin/specialist-form-dialog";
import { ConfirmDeleteDialog } from "@/components/admin/confirm-delete-dialog";
import { WorkingHoursDialog } from "@/components/admin/working-hours-dialog";
import { Plus, Pencil, Trash2, Clock } from "lucide-react";

export default function AdminSpecialistsPage() {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [businessId, setBusinessId] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingSpecialist, setEditingSpecialist] = useState<Specialist | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<Specialist | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [hoursTarget, setHoursTarget] = useState<Specialist | null>(null);

  useEffect(() => {
    async function load() {
      const business = await getMyBusiness();
      if (!business) {
        setIsLoading(false);
        return;
      }
      setBusinessId(business.id);
      const data = await getSpecialistsByBusiness(business.id);
      setSpecialists(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const handleAddNew = () => {
    setEditingSpecialist(null);
    setFormOpen(true);
  };

  const handleEdit = (specialist: Specialist) => {
    setEditingSpecialist(specialist);
    setFormOpen(true);
  };

  const handleSaved = (saved: Specialist) => {
    setSpecialists((prev) => {
      const exists = prev.some((s) => s.id === saved.id);
      return exists ? prev.map((s) => (s.id === saved.id ? saved : s)) : [...prev, saved];
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteSpecialist(deleteTarget.id);
      setSpecialists((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      toast.success("Specialist removed");
      setDeleteTarget(null);
    } catch {
      toast.error("Failed to delete specialist. Please try again.");
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
            Specialists
          </h1>
          <p className="mt-1 text-[14px] text-[#5C7377]">
            Manage the specialists at your business
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex h-10 items-center gap-1.5 rounded-lg bg-[#1F6E71] px-4 text-[14px] font-medium text-white transition hover:bg-[#175457]"
        >
          <Plus className="h-4 w-4" />
          Add specialist
        </button>
      </div>

      {specialists.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#DCE8E7] bg-white py-12 text-center">
          <p className="text-[14px] text-[#9AAAAD]">No specialists yet. Add your first one.</p>
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
                  Specialty
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
              {specialists.map((specialist) => {
                const initials = specialist.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase();

                return (
                  <tr
                    key={specialist.id}
                    className="border-b border-[#DCE8E7] last:border-0 hover:bg-[#F5F8F8]"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        {specialist.imageUrl ? (
                          <img
                            src={specialist.imageUrl}
                            alt={specialist.fullName}
                            className="h-8 w-8 shrink-0 rounded-full border border-[#DCE8E7] object-cover"
                          />
                        ) : (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1F6E71]/10 text-[11px] font-semibold text-[#1F6E71]">
                            {initials}
                          </div>
                        )}
                        <span className="text-[14px] font-medium text-[#14262A]">
                          {specialist.fullName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[14px] text-[#5C7377]">
                      {specialist.specialty || "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={
                          specialist.isActive
                            ? "inline-flex items-center rounded-full bg-[#1F6E71]/10 px-2.5 py-0.5 text-[12px] font-medium text-[#1F6E71]"
                            : "inline-flex items-center rounded-full bg-[#DCE8E7] px-2.5 py-0.5 text-[12px] font-medium text-[#5C7377]"
                        }
                      >
                        {specialist.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => setHoursTarget(specialist)}
                        className="rounded-md p-1.5 text-[#5C7377] transition hover:bg-[#1F6E71]/10 hover:text-[#1F6E71]"
                        aria-label={`Working hours for ${specialist.fullName}`}
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEdit(specialist)}
                        className="rounded-md p-1.5 text-[#5C7377] transition hover:bg-[#1F6E71]/10 hover:text-[#1F6E71]"
                        aria-label={`Edit ${specialist.fullName}`}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(specialist)}
                        className="rounded-md p-1.5 text-[#B54634] transition hover:bg-[#B54634]/10"
                        aria-label={`Delete ${specialist.fullName}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <SpecialistFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        specialist={editingSpecialist}
        onSaved={handleSaved}
      />

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.fullName || ""}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />

      <WorkingHoursDialog
        open={!!hoursTarget}
        onOpenChange={(open) => !open && setHoursTarget(null)}
        specialistId={hoursTarget?.id || null}
        specialistName={hoursTarget?.fullName || ""}
      />
    </div>
  );
}