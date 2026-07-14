import { Trash } from "lucide-react";
import Modal from "../Modal";
import type { ApplicationType } from "./AddApplicationForm";

interface DeleteApplicationPopupProps {
  application: ApplicationType | null;
  onClose: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export default function DeleteApplicationPopup({ application, onClose, onDelete, isLoading = false, }: DeleteApplicationPopupProps) {
  if (!application) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      width="500px"
    >
      <div className="space-y-8 text-text-color">

        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center border border-error-color text-error-color">
            <Trash size={22} />
          </div>

          <div>
            <h2 className="text-xl font-semibold">
              Delete Application
            </h2>

            <p className="mt-1 text-sm text-secondary-color">
              This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="border border-secondary-color p-4 space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-secondary-color">
              Company
            </p>

            <p className="mt-1 font-semibold">
              {application.company}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-secondary-color">
              Role
            </p>

            <p className="mt-1">
              {application.role}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-secondary-color">
              Applied
            </p>

            <p className="mt-1">
              {application.dateApplied}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-secondary-color pt-6">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer bg-secondary-color px-4 py-2 text-sm font-semibold hover:bg-secondary-color/80"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={isLoading}
            className="cursor-pointer bg-error-color px-4 py-2 text-sm font-semibold text-white hover:bg-error-color/80 disabled:opacity-60"
          >
            {isLoading ? "Deleting..." : "Delete"}
          </button>
        </div>

      </div>
    </Modal>
  );
}