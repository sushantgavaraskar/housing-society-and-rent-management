import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { societySchema } from "../../lib/schemas/societySchema";
import { toast } from "sonner";
import API from "../../lib/axios";
import Loader from "../ui/Loader";

export default function SocietyFormModal({ isOpen, setIsOpen, onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(societySchema),
    defaultValues: {
      address: {},
      maintenancePolicy: {}
    }
  });

  const onSubmit = async (data) => {
    try {
      await API.post("/admin/societies", data);
      toast.success("Society created");
      onSuccess();
      setIsOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded shadow p-6 relative">
        <button className="absolute top-3 right-3" onClick={() => setIsOpen(false)}>✖</button>
        <h2 className="text-lg font-semibold mb-4">Create New Society</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Name</label>
            <input {...register("name")} className="input" />
            <p className="text-sm text-red-500">{errors.name?.message}</p>
          </div>

          <div>
            <label>Registration No</label>
            <input {...register("registrationNumber")} className="input" />
            <p className="text-sm text-red-500">{errors.registrationNumber?.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Street</label>
              <input {...register("address.street")} className="input" />
              <p className="text-sm text-red-500">{errors.address?.street?.message}</p>
            </div>
            <div>
              <label>City</label>
              <input {...register("address.city")} className="input" />
              <p className="text-sm text-red-500">{errors.address?.city?.message}</p>
            </div>
            <div>
              <label>State</label>
              <input {...register("address.state")} className="input" />
              <p className="text-sm text-red-500">{errors.address?.state?.message}</p>
            </div>
            <div>
              <label>Pincode</label>
              <input {...register("address.pincode")} className="input" />
              <p className="text-sm text-red-500">{errors.address?.pincode?.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Maintenance Frequency</label>
              <select {...register("maintenancePolicy.frequency")} className="input">
                <option value="">Select</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>
            <div>
              <label>Amount / Flat</label>
              <input {...register("maintenancePolicy.amountPerFlat")} className="input" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded mt-4 flex justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? <Loader /> : "Create Society"}
          </button>
        </form>
      </div>
    </div>
  );
}
