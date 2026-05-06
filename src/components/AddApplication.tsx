import { Plus } from "lucide-react"
import { useState } from "react"
import Modal from "./Modal";
import AddApplicationForm from "./AddApplicationForm";

export default function AddApplication() {

  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);

  return (
    <div className="py-5 flex justify-end">
      <button 
        className="p-3 bg-primary-color text-background-color text-sm font-semibold 
          flex justify-around items-center gap-2 cursor-pointer hover:bg-primary-color/80"
        onClick={() => setIsAddFormOpen(true)}
      >
        <span><Plus/></span>
        <span>Add New Application</span>
      </button>
      <Modal
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        title="Add New Application"
      >
        <AddApplicationForm
          onClose={() => console.log("hmmm")}
        />
      </Modal>
    </div>
  )
}