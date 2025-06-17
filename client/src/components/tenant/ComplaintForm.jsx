import { useForm } from "react-hook-form";
import API from "../../lib/axios";
import { toast } from "sonner";
import Loader from "../ui/Loader";

export default function ComplaintForm({ onSuccess }) {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await API.post("/tenant/complaints/create", data);
      toast.success("Complaint submitted");
      reset();
      onSuccess();
    } catch {
      toast.error("Submission failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded shadow space-y-3 mb-6">
      <h3 className="font-semibold text-lg">New Complaint</h3>
      <select {...register("category")} className="input w-full">
        <option value="">Select category</option>
        <option value="electricity">Electricity</option>
        <option value="water">Water</option>
        <option value="security">Security</option>
      </select>
      <textarea {...register("description")} placeholder="Describe your issue..." className="input w-full" />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader /> : "Submit Complaint"}
      </button>
    </form>
  );
}
