import { useState } from "react"
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router";
import { addApplication, type DbApplication } from "../lib/indexedDb";
import { encryptData } from "../lib/crypto";
import { ChevronDown } from "lucide-react";
import SelectInput from "./form/SelectInput";

export type JobStatus = "Applied" | "Interview" | "Rejected" | "Offer";
export type NextAction = "None" | "Apply" | "Follow Up" | "Interview" | "Assessment" | "Offer";
export type WorkMode = "Remote" | "Hybrid" | "On-site";
export type WorkType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance";


export interface ApplicationType {
  id: number

  company: string
  role: string

  status: JobStatus
  workMode: WorkMode
  workType: WorkType

  dateApplied: string

  jobUrl?: string
  location?: string

  nextAction: NextAction
  nextActionDate?: string

  notes?: string

  favorite?: boolean,
  archived?: boolean,

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
    workMode: "On-site",
    workType: "Full-time",
    dateApplied: new Date().toISOString().split("T")[0],
    nextAction: "None",
    nextActionDate: "",
    notes: "",
    favorite: false,
    archived: false
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMore, setShowMore] = useState(false);

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
      onClose();
      
    } catch(error) {
      //TODO: Handle error (e.g., show a notification)
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = `w-full border border-secondary-color bg-background-color px-3 py-2.5 outline-none transition-colors focus:border-button-color`;
  const errorInputClass = `w-full border border-error-color bg-background-color px-3 py-2.5 outline-none transition-colors`;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col text-text-color">
      <div className="space-y-8">
        <section className="space-y-6">

          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
                Basic Information
            </h2>

            <span className="text-xs text-secondary-color">
                Required
            </span>

          </div>
          <div className="border-b border-secondary-color -mt-2"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1.5">Company</label>
              <input
                name="company"
                placeholder="Google"
                value={form.company}
                onChange={handleChange}
                className = {errors.company ? errorInputClass : inputClass}
              />
              <div className="mt-1 h-4">
                {errors.company && (<p className="text-xs text-error-color">{errors.company}</p>)}
              </div>  
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Role</label>
              <input
                name="role"
                placeholder="Software Engineer"
                value={form.role}
                onChange={handleChange}
                className = {errors.role ? errorInputClass : inputClass}
              />
              <div className="mt-1 h-4">
                {errors.role && (<p className="text-xs text-error-color">{errors.role}</p>)}
              </div>
            </div>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
             <SelectInput<JobStatus>
              name="status"
              value={form.status}
              onChange={handleChange}
              label="Status"
              options={["Applied", "Interview", "Rejected", "Offer"] as JobStatus[]}
            />
            
            <SelectInput<WorkMode>
              name="workMode"
              value={form.workMode}
              onChange={handleChange}
              label="Work Mode"
              options={["Remote", "On-site", "Hybrid"] as WorkMode[]}
            />

            <SelectInput<WorkType>
              name="workType"
              value={form.workType}
              onChange={handleChange}
              label="Work Type"
              options={["Full-time", "Part-time", "Contract", "Internship", "Freelance"] as WorkType[]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Date Applied</label>
            <input
              type="date"
              name="dateApplied"
              value={form.dateApplied}
              onChange={handleChange}
              className={errors.dateApplied ? errorInputClass : inputClass}
            />
            <div className="mt-1 h-4">
              {errors.dateApplied && (<p className="text-xs text-error-color">{errors.dateApplied}</p>)}
            </div>
          </div>
          {
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${showMore ? "max-h-255 opacity-100 mt-8" : "max-h-0 opacity-0"}`}
            >
              <section className="space-y-8 pt-8 border-t border-secondary-color">
                <section className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-text-color/70">
                    Job Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1.5">Job URL</label>
                      <input
                        name="jobUrl"
                        value={form.jobUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        className={errors.jobUrl ? errorInputClass : inputClass}
                      />
                      <div className="mt-1 h-4">
                        {errors.jobUrl && (<p className="text-xs text-error-color">{errors.jobUrl}</p>)}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1.5">Location</label>
                      <input
                        name="location"
                        placeholder="New York, USA"
                        value={form.location}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-text-color/70">
                    Follow Up
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <SelectInput<NextAction>
                      name="nextAction"
                      value={form.nextAction}
                      onChange={handleChange}
                      label="Next Action"
                      options={["None", "Apply", "Follow Up", "Interview", "Assessment", "Offer"] as NextAction[]}
                    />

                    {
                      form.nextAction !== "None" && (
                        <div>
                          <label className="block text-sm font-medium mb-1.5">Next Action Date</label>
                          <input
                            type="date"
                            name="nextActionDate"
                            value={form.nextActionDate}
                            onChange={handleChange}
                            className={inputClass}
                          />
                        </div>
                      )
                    }
                  </div>
                </section>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Notes</label>
                  <textarea
                    name="notes"
                    placeholder="Prepare for the DSA interview..."
                    value={form.notes}
                    onChange={handleChange}
                    rows={6}
                    className={`${inputClass} resize-y`}
                  />
                </div>
              </section>
            </div>
          
          }

          <div className="flex flex-col gap-4 md:flex-row justify-between items-center border-t border-secondary-color pt-8 mt-8">
            <button
              type="button"
              onClick={() => setShowMore(!showMore)}
              className="flex items-center gap-2 text-sm font-medium cursor-pointer"
            >
              <ChevronDown
                size={18}
                className={`transition-transform duration-300 ${showMore ? "rotate-180" : ""}`}
              />
              <span>
                {showMore ? "Hide Additional Details" : "Show Additional Details"}
              </span>
            </button>

            <div className="flex gap-3">
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
          </div>
        </section>
      </div>
    </form>
  )
}