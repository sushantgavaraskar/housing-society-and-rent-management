import { useForm } from "react-hook-form";
import API from "../../lib/axios";
import { toast } from "sonner";
import Loader from "../ui/Loader";

export default function OwnershipRequestForm({ ownedFlats, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await API.post("/owner/ownership-request", data);
      toast.success("Ownership transfer request submitted");
      reset();
      onSuccess();
    } catch {
      toast.error("Failed to submit request");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-5 shadow rounded mb-6">
      <h3 className="text-lg font-semibold">Request Transfer</h3>
      <div>
        <label>Flat</label>
        <select {...register("flatId")} className="input w-full">
          <option value="">Select flat</option>
          {ownedFlats.map((f) => (
            <option key={f._id} value={f._id}>
              {f.flatNumber} - {f.building?.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>New Owner Email</label>
        <input {...register("newOwnerEmail")} placeholder="new@example.com" className="input w-full" />
      </div>

      <div>
        <label>Reason (optional)</label>
        <textarea {...register("note")} className="input w-full" rows={3} />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white py-2 px-4 rounded w-full flex justify-center"
        disabled={isSubmitting}
      >
        {isSubmitting ? <Loader /> : "Submit Request"}
      </button>
    </form>
  );
}
