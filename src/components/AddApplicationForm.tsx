import { useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { addApplication, type DbApplication } from "../lib/indexedDb";
import { encryptData } from "../lib/crypto";

export type JobStatus = "Applied" | "Interview" | "Rejected" | "Offer";

export interface ApplicationType {
  id: number
  company: string
  role: string
  jobUrl?: string
  location?: string
  status: JobStatus
  dateApplied: string
  nextAction?: string
  nextActionDate?: string
  notes?: string
  createdAt?: string
  updatedAt?: string
}

interface AddJobFormProps {
  onClose: () => void;
}

type FormState = Omit<ApplicationType, "id" | "createdAt" | "updatedAt">

export default function AddApplicationForm({ onClose }: AddJobFormProps) {
  const [form, setForm] = useState<FormState>({
    company: "",
    role: "",
    jobUrl: "",
    location: "",
    status: "Applied",
    dateApplied: "",
    nextAction: "",
    nextActionDate: "",
    notes: ""
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { user, key: cryptoKey } = useAuth();
  const navigate = useNavigate();

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors: Partial<Record<keyof FormState, string>> = {};

    if (!form.company.trim()) newErrors.company = "Company is required";
    if (!form.role.trim()) newErrors.role = "Role is required";
    if (!form.dateApplied) newErrors.dateApplied = "Date is required";

    if (form.jobUrl && !/^https?:\/\/.+/.test(form.jobUrl)) {
      newErrors.jobUrl = "Invalid URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    try {
      if(!cryptoKey || !user) {
        //TODO: Show Error in Toast
        navigate("/login");
        throw new Error("User not logged in!");
      }

      if (!validate()) return

      const encryptedApp = await encryptData(form, cryptoKey);

      const newApplication: Omit<DbApplication, "id" | "createdAt" | "updatedAt"> = {
        userId: user.id,
        iv: encryptedApp.iv,
        ciphertext: encryptedApp.ciphertext
      }

      await addApplication(newApplication);
      
    } catch(error) {
      console.error(error);
    } finally {
      setIsLoading(false);
      onClose();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-text-color">

      <div>
        <label className="text-sm text-text-color font-semibold">Company *</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          className={`w-full mt-1 p-1 border-b ${errors.company ? "border-error-color" : "border-secondary-color"} focus:outline-none focus:border-button-color font-normal tracking-wide`}
        />
        {errors.company && <span className="text-xs text-error-color">{errors.company}</span>}
      </div>

      <div>
        <label className="text-sm text-text-color font-semibold">Role *</label>
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          className={`w-full mt-1 p-1 border-b ${errors.role ? "border-error-color" : "border-secondary-color"} focus:outline-none focus:border-button-color font-normal tracking-wide`}
        />
        {errors.role && <span className="text-xs text-error-color">{errors.role}</span>}
      </div>

      <div>
        <label className="text-sm text-text-color font-semibold">Job URL</label>
        <input
          name="jobUrl"
          value={form.jobUrl}
          onChange={handleChange}
          placeholder="https://..."
          className={`w-full mt-1 p-1 border-b ${errors.jobUrl ? "border-error-color" : "border-secondary-color"} focus:outline-none focus:border-button-color font-normal tracking-wide`}
        />
        {errors.jobUrl && <span className="text-xs text-error-color">{errors.jobUrl}</span>}
      </div>

      <div>
        <label className="text-sm text-text-color font-semibold">Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-text-color font-semibold">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
          >
            {(["Applied", "Interview", "Rejected", "Offer"] as JobStatus[]).map(s => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm text-text-color font-semibold">Date Applied *</label>
          <input
            type="date"
            name="dateApplied"
            value={form.dateApplied}
            onChange={handleChange}
            className={`w-full mt-1 p-1 border-b ${errors.dateApplied ? "border-error-color" : "border-secondary-color"} focus:outline-none focus:border-button-color font-normal tracking-wide`}
          />
          {errors.dateApplied && <span className="text-xs text-error-color">{errors.dateApplied}</span>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-text-color font-semibold">Next Action</label>
          <input
            name="nextAction"
            value={form.nextAction}
            onChange={handleChange}
            className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
          />
        </div>

        <div>
          <label className="text-sm text-text-color font-semibold">Next Action Date</label>
          <input
            type="date"
            name="nextActionDate"
            value={form.nextActionDate}
            onChange={handleChange}
            className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-text-color font-semibold">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer px-4 py-2 bg-secondary-color text-text-color hover:bg-secondary-color/80 text-sm font-semibold"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="cursor-pointer px-4 py-2 bg-button-color text-background-color hover:bg-button-color/80 text-sm font-semibold"
        >
          {isLoading ? "Adding..." : "Add Application"}
        </button>
      </div>
    </form>
  )
}