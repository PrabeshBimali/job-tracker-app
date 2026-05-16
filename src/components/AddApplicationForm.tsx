import { useState } from "react"

export type JobStatus = "Applied" | "Interview" | "Rejected" | "Offer";

export interface Application {
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
  createdAt: string
  updatedAt: string
}

interface AddJobFormProps {
 // onSubmit: (job: Job) => void;
  onClose: () => void;
}

type FormState = Omit<Application, "id" | "createdAt" | "updatedAt">

export default function AddApplicationForm({ /*onSubmit,*/ onClose }: AddJobFormProps) {
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

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!validate()) return

    const now = new Date().toISOString()

   // onSubmit({
   //   ...form,
   //   id: Date.now(),
   //   createdAt: now,
   //   updatedAt: now
   // })

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-text-color">

      <div>
        <label className="text-sm font-semibold text-text-color">Company *</label>
        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
        />
        {errors.company && <p className="text-red-500 text-xs">{errors.company}</p>}
      </div>

      <div>
        <label className="text-sm font-semibold text-text-color">Role *</label>
        <input
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
        />
        {errors.role && <p className="text-red-500 text-xs">{errors.role}</p>}
      </div>

      <div>
        <label className="text-sm font-semibold text-text-color">Job URL</label>
        <input
          name="jobUrl"
          value={form.jobUrl}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
        />
        {errors.jobUrl && <p className="text-red-500 text-xs">{errors.jobUrl}</p>}
      </div>

      <div>
        <label className="text-sm font-semibold text-text-color">Location</label>
        <input
          name="location"
          value={form.location}
          onChange={handleChange}
          className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-text-color">Status</label>
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
          <label className="text-sm font-semibold text-text-color">Date Applied *</label>
          <input
            type="date"
            name="dateApplied"
            value={form.dateApplied}
            onChange={handleChange}
            className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
          />
          {errors.dateApplied && <p className="text-red-500 text-xs">{errors.dateApplied}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-text-color">Next Action</label>
          <input
            name="nextAction"
            value={form.nextAction}
            onChange={handleChange}
            className="w-full mt-1 p-2 bg-background-color border-b-2 border-secondary-color focus:outline-none focus:border-button-color"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-text-color">Next Action Date</label>
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
        <label className="text-sm font-semibold text-text-color">Notes</label>
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
          className="cursor-pointer px-4 py-2 rounded-md bg-secondary-color text-white hover:bg-secondary-color/80"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="cursor-pointer px-4 py-2 rounded-md bg-button-color text-background-color hover:bg-button-color/80"
        >
          Save
        </button>
      </div>
    </form>
  )
}