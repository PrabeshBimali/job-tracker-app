import { FolderOpen } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { useRef, useState } from "react";
import { formatFileSize, getErrorMessage } from "../lib/utilities";
import restoreBackup, { createBackupPreview, parseBackup, type BackupPreview } from "../lib/restoreBackup";
import type { BackupFile } from "../lib/exportBackup";

const MAX_FILE_SIZE =  20 * 1024 * 1024; // 20 MB

export default function RestoreBackupPage() {


  const [file, setFile] = useState<File | null>(null);
  const [password, setPasword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPaswordError] = useState<string>("")
  const [fileError, setFileError] = useState<string>("");
  const [backupFile, setBackupFile] = useState<BackupFile | null>(null);
  const [preview, setPreview] = useState<BackupPreview | null>(null)

  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setFileError("");
      setPaswordError("");
      setFile(null);
      setBackupFile(null);
      setPreview(null);

      const fileVal = e.target.files?.[0];

      if(!fileVal) return;

      if(fileVal.size > MAX_FILE_SIZE) {
        setFileError("File size must be 20 MB or less");
        return;
      }
      setFile(fileVal);
      const content = await fileVal.text();
      const backup = parseBackup(content);
      setBackupFile(backup);
      setPreview(createBackupPreview(backup));

    } catch(error) {
      setFileError(getErrorMessage(error));
      console.error(error);
    }
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setPasword(value);
  }

  function onBrowse() {
    inputRef.current?.click();
  }

  async function onRestore() {
    if(!file) return;

    try {

      const content = await  file.text();
      const backup = parseBackup(content);
      setBackupFile(backup);


    } catch(error){
      //TODO: Add toast to show error
      console.error(error)
    }
  }

  return (
    <AuthLayout>
      <input
        ref={inputRef}
        type="file"
        accept=".json"
        hidden
        onChange={handleFileSelect}
      />

      <div className="w-11/12 sm:w-5/6 md:w-1/2 lg:w-1/5 bg-primary-color flex flex-col gap-3 p-5 rounded-sm">
        <h1 className="text-3xl font-bold text-center text-text-color">
          Restore Backup
        </h1>

        <div className="flex flex-col gap-5 text-text-color">

          <div className="flex items-center gap-3">
            <FolderOpen
              size={24}
              className="text-accent-color"
            />

            <div>
              <p className="mt-1 text-sm text-text-color/70">
                Restore your applications from a previously exported backup.
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm">
              Backup File:
            </label>

            <div className={`flex items-center justify-between gap-4 border ${fileError ? "border-error-color" : "border-secondary-color"} p-3`}>
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
            <div className="mt-1 h-4">
              {fileError && (<p className="text-sm text-error-color">{fileError}</p>)}
            </div>
          </div>

          {preview && (
            <div className="space-y-2">
              <label className="text-sm">Backup Preview:</label>

              <div className="border border-secondary-color bg-background-color">
                <div className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 px-4 py-4 text-sm">
                  <span className="text-text-color/70">Username</span>
                  <span className="font-semibold text-text-color">
                    {preview.username}
                  </span>

                  <span className="text-text-color/70">Applications</span>
                  <span className="font-semibold text-text-color">
                    {preview.applicationCount}
                  </span>

                  <span className="text-text-color/70">Created</span>
                  <span className="font-semibold text-text-color">
                    {preview.createdAt}
                  </span>
                </div>
              </div>
            </div>
          )}

          {preview &&
            <div className="space-y-2">
              <label className="text-sm">Password For Backup:</label>
              <div className="w-full relative">
                <input 
                  value={password}
                  onChange={e => handlePasswordChange(e)}
                  name="password"
                  type={ showPassword ? "text" : "password" } 
                  className={`w-full border-b ${ passwordError ? "border-error-color" : "border-secondary-color"} p-1 focus:outline-none focus:border-button-color font-normal tracking-wide bg-transparent`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-0 bottom-1 text-sm text-button-color hover:text-button-color/80 focus:outline-none cursor-pointer"
                  >
                    { showPassword ? "Hide" : "Show" } 
                </button>
              </div>
            </div>
          }

          <button 
            disabled={!preview}
            className="py-3 font-semibold text-primary-color bg-button-color cursor-pointer hover:bg-button-color/80 disabled:bg-button-color/60 disabled:cursor-not-allowed"
          >
            Restore
          </button>

          <div className="flex justify-center items-center gap-1">
            <span className="text-sm text-text-color">
              Don't have an account? 
            </span>
            <a href="/register" className="text-button-color hover:text-button-color/80 font-semibold">
              Register
            </a>
          </div>

        </div>
      </div>
    </AuthLayout>
  )
}