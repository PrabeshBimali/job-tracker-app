import { FolderOpen, TriangleAlert } from "lucide-react";
import Modal from "../Modal";
import { useRef, useState } from "react";
import { formatFileSize } from "../../lib/utilities";

interface RestoreBackupPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RestoreBackupPopup({ isOpen, onClose }: RestoreBackupPopupProps) {

  const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;

    if(!files) return;
    setFile(files[0]);
  }

  function onBrowse() {
    inputRef.current?.click();
  }

  function onRestore() {

  }

  function onCancel() {
    setFile(null);
    onClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      width="640px"
    >
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        hidden
        onChange={handleFileSelect}
      />
      <div className="flex flex-col gap-8 text-text-color">

        <div className="flex items-center gap-3">
          <FolderOpen
            size={24}
            className="text-accent-color"
          />

          <div>
            <h2 className="text-xl font-semibold text-text-color">
              Restore Backup
            </h2>

            <p className="mt-1 text-sm text-text-color/70">
              Restore your applications from a previously exported backup.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-text-color">
            Backup File
          </label>

          <div className="flex items-center justify-between gap-4 border border-secondary-color p-3">
            <span className="truncate text-sm text-text-color/80">
              {file ? `${file.name} (${formatFileSize(file.size)})` : "No file selected"}
            </span>

            <button
              type="button"
              onClick={onBrowse}
              className="cursor-pointer border border-secondary-color px-4 py-2 text-sm transition-colors hover:border-button-color"
            >
              Browse
            </button>
          </div>
        </div>

        <div className="border border-error-color/40 bg-error-color/10 p-4">
          <div className="flex items-start gap-3">

            <TriangleAlert
              size={20}
              className="mt-0.5 shrink-0 text-error-color"
            />

            <div className="space-y-2 text-sm">
              <p className="font-medium text-error-color">
                Restoring a backup will replace your current data.
              </p>

              <ul className="ml-5 list-disc space-y-1 text-text-color/80">
                <li>All current applications will be deleted.</li>
                <li>Your encryption salt will be replaced.</li>
                <li>The selected backup will become your active data.</li>
              </ul>

              <p className="pt-2 text-xs text-text-color/60">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer border border-secondary-color px-5 py-2 transition-colors hover:border-button-color"
          >
            Cancel
          </button>

          <button
            disabled={!file}
            onClick={onRestore}
            className="cursor-pointer bg-button-color px-5 py-2 font-semibold text-background-color transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Restore Backup
          </button>
        </div>

      </div>
    </Modal>
  );
}