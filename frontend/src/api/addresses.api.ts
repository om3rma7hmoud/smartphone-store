import axiosClient from "./axiosClient";
import type { Address } from "../types";

export type AddressPayload = Omit<Address, "id" | "createdAt">;

export type UpdateAddressPayload = Partial<AddressPayload>;

export async function getAddresses(): Promise<Address[]> {
  const res = await axiosClient.get("/addresses");
  return res.data.data.addresses;
}

export async function createAddress(data: AddressPayload): Promise<Address> {
  const res = await axiosClient.post("/addresses", data);
  return res.data.data.address;
}

export async function updateAddress(
  id: string,
  data: UpdateAddressPayload,
): Promise<Address> {
  const res = await axiosClient.patch(`/addresses/${id}`, data);
  return res.data.data.address;
}

export async function setDefaultAddress(id: string): Promise<void> {
  await axiosClient.patch(`/addresses/${id}/default`);
}

export async function deleteAddress(id: string): Promise<void> {
  await axiosClient.delete(`/addresses/${id}`);
}
