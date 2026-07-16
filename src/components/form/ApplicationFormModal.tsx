import Modal from "../Modal";
import ApplicationForm, { type ApplicationType } from "./ApplicationForm";

interface ApplicationFormModalProps {
  formData?: ApplicationType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationFormModal({ formData = null, isOpen, onClose }: ApplicationFormModalProps) {
  return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        width="720px"
      >
        <ApplicationForm
          formData={formData}
          onClose={onClose}
        />
      </Modal>
  )
}