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
      width="400px"
    >
      <div className="space-y-8 text-text-color">

        <div className="flex justify-center items-start gap-4">
          <div className="flex h-12 w-12 border-2 border-error-color rounded-sm items-center justify-center text-error-color">
            <Trash size={25} />
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
            <p className="text-xs uppercase tracking-wider text-text-color/80">
              Company
            </p>

            <p className="mt-1 font-semibold">
              {application.company}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-text-color/80">
              Role
            </p>

            <p className="mt-1">
              {application.role}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-text-color/80">
              Applied
            </p>

            <p className="mt-1">
              {application.dateApplied}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-3">
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