import { useForm } from "react-hook-form";
import { toast } from "sonner";
import API from "../../lib/axios";
import Loader from "../ui/Loader";

export default function ResolveComplaintModal({ isOpen, setIsOpen, complaintId, onSuccess }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await API.put(`/admin/complaints/${complaintId}/status`, {
        status: "resolved",
        note: data.note
      });
      toast.success("Marked as resolved");
      onSuccess();
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to update complaint");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Resolve Complaint</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            {...register("note")}
            placeholder="Add a resolution note..."
            className="w-full border rounded p-2"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 rounded flex justify-center"
          >
            {isSubmitting ? <Loader /> : "Resolve Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}
