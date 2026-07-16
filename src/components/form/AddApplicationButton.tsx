import { Plus } from "lucide-react"
import { useState } from "react"
import ApplicationFormModal from "./ApplicationFormModal";

export default function AddApplicationButton() {

  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);

  return (
    <div className="py-5 flex justify-end">
      <button 
        className="p-3 bg-button-color text-background-color text-sm font-semibold 
          flex justify-around items-center gap-2 cursor-pointer hover:bg-button-color/80"
        onClick={() => setIsAddFormOpen(true)}
      >
        <span><Plus/></span>
        <span>Add New Application</span>
      </button>
      <ApplicationFormModal
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
      />
    </div>
  )
}