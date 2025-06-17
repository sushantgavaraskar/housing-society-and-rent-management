import { useForm } from "react-hook-form";
import { toast } from "sonner";
import API from "../../lib/axios";
import Loader from "../ui/Loader";

export default function AssignTenantModal({ isOpen, setIsOpen, flatId, onSuccess }) {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await API.put("/owner/flats/assign-tenant", {
        flatId,
        tenantEmail: data.tenantEmail
      });
      toast.success("Tenant assigned");
      onSuccess();
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to assign tenant");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Assign Tenant</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("tenantEmail")}
            placeholder="Tenant email"
            className="w-full border p-2 rounded"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white py-2 px-4 rounded w-full flex justify-center"
          >
            {isSubmitting ? <Loader /> : "Assign Tenant"}
          </button>
        </form>
      </div>
    </div>
  );
}
