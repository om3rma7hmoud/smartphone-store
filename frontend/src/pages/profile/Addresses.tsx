import { useEffect, useState } from "react";
import {
  PlusIcon,
  PencilIcon,
  Trash2Icon,
  XIcon,
  MapPinIcon,
} from "lucide-react";
import { toast } from "react-toastify";

import { useAddressesStore } from "../../store/addressesStore";
import type { Address } from "../../types";

type AddressFormData = {
  fullName: string;
  phone: string;
  city: string;
  area: string;
  street: string;
  isDefault: boolean;
};

const initialForm: AddressFormData = {
  fullName: "",
  phone: "",
  city: "",
  area: "",
  street: "",
  isDefault: false,
};

function Addresses() {
  const {
    addresses,
    isLoading,
    fetchAddresses,
    addAddress,
    editAddress,
    makeDefault,
    removeAddress,
  } = useAddressesStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<AddressFormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchAddresses().catch(() => {
      toast.error("Failed to load addresses");
    });
  }, [fetchAddresses]);

  const sorted = [...addresses].sort(
    (a, b) => Number(b.isDefault) - Number(a.isDefault),
  );

  const openAddModal = () => {
    setEditingAddress(null);
    setFormData({
      ...initialForm,
      isDefault: addresses.length === 0,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      area: address.area,
      street: address.street,
      isDefault: address.isDefault,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting) return;

    setIsModalOpen(false);
    setEditingAddress(null);
    setFormData(initialForm);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      if (editingAddress) {
        await editAddress(editingAddress.id, formData);
        toast.success("Address updated successfully");
      } else {
        await addAddress(formData);
        toast.success("Address added successfully");
      }

      setIsModalOpen(false);
      setEditingAddress(null);
      setFormData(initialForm);
    } catch (error) {
      console.error("Address operation failed:", error);
      toast.error("Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      await makeDefault(id);
      toast.success("Default address updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update default address");
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?",
    );

    if (!confirmed) return;

    try {
      await removeAddress(id);
      toast.success("Address deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete address");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-ink text-[17px] font-semibold">Saved addresses</h2>

        <button
          type="button"
          onClick={openAddModal}
          className="border-line-strong text-ink ease-premium hover:border-ink inline-flex h-10 items-center gap-2 border px-4 text-[13.5px] font-medium transition-colors duration-150"
        >
          <PlusIcon size={15} />
          Add address
        </button>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="text-ink-400 py-12 text-center text-sm">
          Loading addresses...
        </div>
      )}

      {/* Empty State */}
      {!isLoading && addresses.length === 0 && (
        <div className="border-line mt-5 flex flex-col items-center border border-dashed px-5 py-12 text-center">
          <MapPinIcon size={30} className="text-ink-400" />

          <h3 className="text-ink mt-4 text-[15px] font-semibold">
            No saved addresses
          </h3>

          <p className="text-ink-400 mt-2 text-[13px]">
            Add your first address to make checkout easier.
          </p>

          <button
            type="button"
            onClick={openAddModal}
            className="bg-ink mt-5 px-5 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-80"
          >
            Add your first address
          </button>
        </div>
      )}

      {/* Addresses List */}
      {!isLoading && addresses.length > 0 && (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {sorted.map((address) => (
            <li
              key={address.id}
              className={`border p-5 ${
                address.isDefault ? "border-ink" : "border-line"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-ink text-[14.5px] font-semibold">
                  {address.area}, {address.city}
                </span>

                {address.isDefault && (
                  <span className="border-line bg-surface-muted text-ink-600 border px-1.5 py-0.5 text-[11px] font-medium tracking-[0.08em] uppercase">
                    Default
                  </span>
                )}
              </div>

              <p className="text-ink mt-3 text-[14px]">{address.fullName}</p>

              <p className="text-ink-400 mt-1 text-[13.5px] leading-relaxed">
                {address.street}
                <br />
                {address.area}, {address.city}
                <br />
                {address.phone}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-[13.5px] font-medium">
                <button
                  type="button"
                  onClick={() => openEditModal(address)}
                  className="text-ink ease-premium hover:text-accent inline-flex items-center gap-1.5 transition-colors duration-150"
                >
                  <PencilIcon size={13} />
                  Edit
                </button>

                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(address.id)}
                    className="text-ink-400 ease-premium hover:text-ink transition-colors duration-150"
                  >
                    Set as default
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDelete(address.id)}
                  className="inline-flex items-center gap-1.5 text-red-500 transition-colors hover:text-red-700"
                >
                  <Trash2Icon size={13} />
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface w-full max-w-lg">
            {/* Modal Header */}
            <div className="border-line flex items-center justify-between border-b p-5">
              <h3 className="text-ink text-[16px] font-semibold">
                {editingAddress ? "Edit address" : "Add new address"}
              </h3>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="text-ink-400 hover:text-ink"
              >
                <XIcon size={19} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              {[
                {
                  name: "fullName",
                  label: "Full name",
                  placeholder: "Enter full name",
                },
                {
                  name: "phone",
                  label: "Phone number",
                  placeholder: "Enter phone number",
                },
                { name: "city", label: "City", placeholder: "Enter city" },
                { name: "area", label: "Area", placeholder: "Enter area" },
                {
                  name: "street",
                  label: "Street address",
                  placeholder: "Enter street address",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="text-ink mb-1.5 block text-[13px] font-medium"
                  >
                    {field.label}
                  </label>

                  <input
                    id={field.name}
                    name={field.name}
                    type="text"
                    value={
                      formData[field.name as keyof AddressFormData] as string
                    }
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                    disabled={isSubmitting}
                    className="border-line text-ink placeholder:text-ink-400 focus:border-ink h-11 w-full border bg-transparent px-3 text-[13.5px] transition-colors outline-none"
                  />
                </div>
              ))}

              <label className="text-ink flex cursor-pointer items-center gap-2 text-[13px]">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="accent-current"
                />
                Set as default address
              </label>

              {/* Actions */}
              <div className="border-line flex justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="border-line-strong text-ink hover:border-ink h-10 border px-5 text-[13px] font-medium disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-ink h-10 min-w-28 px-5 text-[13px] font-medium text-white transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingAddress
                      ? "Save changes"
                      : "Add address"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Addresses;
