import { FolderOpen, User, Briefcase, CalendarDays, TriangleAlert, CheckCheck } from "lucide-react";
import AuthLayout from "../layouts/AuthLayout";
import { useRef, useState } from "react";
import { formatFileSize, getErrorMessage } from "../lib/utilities";
import { createBackupPreview, deserilizeBackup, parseBackup, restoreBackupData, usernameExists, validateApplicationsCipher, verifyBackupPassword, type BackupPreview } from "../lib/restoreBackup";
import type { BackupFile } from "../lib/exportBackup";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";


const MAX_FILE_SIZE =  20 * 1024 * 1024; // 20 MB

export default function RestoreBackupPage() {


  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>("");

  const [password, setPasword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordError, setPaswordError] = useState<string>("")

  const [backupFile, setBackupFile] = useState<BackupFile | null>(null);
  const [preview, setPreview] = useState<BackupPreview | null>(null)

  const [needsNewUsername, setNeedsNewUsername] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernmeError] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    try {
      setFileError("");
      setPaswordError("");
      setFile(null);
      setBackupFile(null);
      setPreview(null);
      setNeedsNewUsername(false);
      setUsername("");
      setUsernmeError("");

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
      setNeedsNewUsername(await usernameExists(backup.user.username));

    } catch(error) {
      setFileError(getErrorMessage(error));
      console.error(error);
    }
  }

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>, field: "username" | "password") {
    const value = e.target.value;

    if(field === "password") {
      setPaswordError("");
      setPasword(value);
      return;
    }

    setUsernmeError("");
    setUsername(value);
  }

  async function validateUsername(): Promise<boolean> {
    const name = username.trim().toLowerCase();

    if(!name) {
      setUsernmeError("Username is Required");
      return false;
    }
    
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setUsernmeError("Username can only contain number or letters");
      return false;
    }

    if(await usernameExists(username)) {
      setUsernmeError("Username Already Exists");
      return false;
    }

    return true;
  }

  async function onUsernameChange() {
    const isUsernameValid = await validateUsername();

    if(!isUsernameValid) return;

    setBackupFile(prev => {
      if (!prev) return prev;

      return {
        ...prev,
        user: {
          ...prev.user,
          username: username,
        },
      };
    });

    setPreview(prev => {
      if(!prev) return prev;

      return {
        ...prev,
        username: username,
      }
    });

    setNeedsNewUsername(false);
    setUsernmeError("");
  }

  function onBrowse() {
    inputRef.current?.click();
  }

  async function onRestore() {

    if(!password) {
      setPaswordError("Password is Required");
      return;
    }

    if(!backupFile) return;

    try {
      const { user, dbApplications } = deserilizeBackup(backupFile);
      const key = await verifyBackupPassword(password, user);

      if(!key) {
        setPaswordError("Invalid Password");
        return;
      }

      // validate ciphertext of each applications
      await validateApplicationsCipher(dbApplications, key);

      const userid = await restoreBackupData(user, dbApplications);

      const authUser = { id: userid, username: user.username };
      login(authUser, key); 
      navigate("/");

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
              <label className="text-sm">Backup Preview</label>
          
              <div className="border border-secondary-color bg-background-color p-4">
                <div className="space-y-4 text-sm">
          
                  <div className="flex items-center gap-3">
                    <User
                      size={18}
                      className="text-accent-color shrink-0"
                    />

                    <div>
                      <p className="text-xs text-text-color/60">
                        Username
                      </p>
                      <p className="font-semibold">
                        {preview.username}
                      </p>
                      <p className={`text-xs flex items-center gap-1 ${needsNewUsername ? "text-error-color" : "text-success-color"}`}>
                        {needsNewUsername ? <TriangleAlert size={12}/> : <CheckCheck size={12}/>}
                        {needsNewUsername ? "Username Exists!" : "Available!"}
                      </p>
                    </div>
                  </div>
          
                  <div className="flex items-center gap-3">
                    <Briefcase
                      size={18}
                      className="text-accent-color shrink-0"
                    />

                    <div>
                      <p className="text-xs text-text-color/60">
                        Applications
                      </p>
                      <p className="font-semibold">
                        {preview.applicationCount}
                      </p>
                    </div>
                  </div>
          
                  <div className="flex items-center gap-3">
                    <CalendarDays
                      size={18}
                      className="text-accent-color shrink-0"
                    />

                    <div>
                      <p className="text-xs text-text-color/60">
                        Backup Created
                      </p>
                      <p className="font-semibold">
                        {preview.createdAt}
                      </p>
                    </div>
                  </div>
          
                </div>
              </div>
            </div>
          )}

          {preview && needsNewUsername &&
            <>
              <div className="space-y-2">
                <label className="text-sm">Pick New Username:</label>
                <div className="w-full relative">
                  <input 
                    value={username}
                    onChange={e => handleTextChange(e, "username")}
                    name="username"
                    type="text" 
                    className={`w-full border-b ${ passwordError ? "border-error-color" : "border-secondary-color"} p-1 focus:outline-none focus:border-button-color font-normal tracking-wide bg-transparent`}
                  />
                  <span className="text-xs text-error-color">
                    {usernameError}
                  </span>
                </div>
              </div>
              <button 
                onClick={onUsernameChange}
                className="py-3 font-semibold text-primary-color bg-button-color cursor-pointer hover:bg-button-color/80" 
              >
                Continue
              </button>
            </>
          }

          {preview && !needsNewUsername &&
            <>
              <div className="space-y-2">
                <label className="text-sm">Password:</label>
                <div className="w-full relative">
                  <input 
                    value={password}
                    onChange={e => handleTextChange(e, "password")}
                    name="password"
                    type={ showPassword ? "text" : "password" } 
                    className={`w-full border-b ${ passwordError ? "border-error-color" : "border-secondary-color"} p-1 focus:outline-none focus:border-button-color font-normal tracking-wide bg-transparent`}
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className={`absolute right-0 bottom-1 text-sm ${ passwordError ? "text-error-color" : "text-button-color" } hover:text-button-color/80 focus:outline-none cursor-pointer`}
                    >
                      { showPassword ? "Hide" : "Show" } 
                  </button>
                </div>
                <span className="text-xs text-error-color">
                  {passwordError}
                </span>
              </div>
              <button 
                disabled={!preview}
                onClick={onRestore}
                className="py-3 font-semibold text-primary-color bg-button-color cursor-pointer hover:bg-button-color/80 disabled:bg-button-color/60 disabled:cursor-not-allowed"
              >
                Restore
              </button>
            </>
          }


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