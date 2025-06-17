import { useForm } from "react-hook-form";
import { toast } from "sonner";
import API from "../../lib/axios";
import Loader from "../ui/Loader";

export default function AssignOccupantModal({ isOpen, setIsOpen, flatId, type = "owner", onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const url = `/admin/flats/assign-${type}`;
      await API.put(url, { flatId, userEmail: data.userEmail });
      toast.success(`${type} assigned successfully`);
      reset();
      onSuccess();
      setIsOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to assign ${type}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-md rounded shadow p-6 relative">
        <button className="absolute top-3 right-3" onClick={() => setIsOpen(false)}>✖</button>
        <h2 className="text-lg font-semibold mb-4">Assign {type}</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>User Email</label>
            <input {...register("userEmail")} className="input" placeholder="email@example.com" />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded flex justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader /> : `Assign ${type}`}
          </button>
        </form>
      </div>
    </div>
  );
}
