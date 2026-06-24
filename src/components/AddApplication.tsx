import { Plus } from "lucide-react"
import { useState } from "react"
import Modal from "./Modal";
import AddApplicationForm, { type Application } from "./AddApplicationForm";

export default function AddApplication() {

  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);

  function handleAddJob(job: Application) {
    console.log("New Job Added:", job);
  }

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
      <Modal
        isOpen={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        width="900px"
        title="Add New Application"
      >
        <AddApplicationForm
          onSubmit={handleAddJob}
          onClose={() => setIsAddFormOpen(false)}
        />
      </Modal>
    </div>
  )
}