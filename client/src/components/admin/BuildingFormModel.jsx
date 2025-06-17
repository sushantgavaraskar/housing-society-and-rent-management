import { useForm } from "react-hook-form";
import { toast } from "sonner";
import API from "../../lib/axios";
import Loader from "../ui/Loader";

export default function BuildingFormModal({ isOpen, setIsOpen, onSuccess, societies }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await API.post("/admin/buildings", data);
      toast.success("Building created");
      onSuccess();
      setIsOpen(false);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded shadow p-6 relative">
        <button className="absolute top-3 right-3" onClick={() => setIsOpen(false)}>✖</button>
        <h2 className="text-lg font-semibold mb-4">Add New Building</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Society</label>
            <select {...register("societyId")} className="input">
              <option value="">Select...</option>
              {societies.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.registrationNumber})
                </option>
              ))}
            </select>
            <p className="text-red-500 text-sm">{errors.societyId?.message}</p>
          </div>

          <div>
            <label>Building Name</label>
            <input {...register("name")} className="input" />
            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Total Floors</label>
              <input {...register("totalFloors")} type="number" className="input" />
            </div>
            <div>
              <label>Total Flats</label>
              <input {...register("totalFlats")} type="number" className="input" />
            </div>
          </div>

          <div>
            <label>Address Label (optional)</label>
            <input {...register("addressLabel")} className="input" />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded mt-4 flex justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader /> : "Create Building"}
          </button>
        </form>
      </div>
    </div>
  );
}
