import {
  InactiveUsers,
  HighValueCustomers,
  SendCampaignEmail,
} from "@/actions/campaign.action";
import toast from "react-hot-toast";
import { create } from "zustand";

interface CampaignStore {
  loadInactiveUsers: boolean;
  loadHighValueCustomers: boolean;
  inactiveUsers: { id: string; email: string; name: string }[];
  highValueCustomers: { id: string; email: string; name: string }[];

  fetchInactiveUsers: (productId: string) => void;
  fetchHighValueCustomers: () => void;

  sendEmail: (
    productId: string,
    userIds: string[],
    campaignType: "inactive" | "highValue"
  ) => void;
}

const useCampaignStore = create<CampaignStore>((set) => ({
  loadInactiveUsers: false,
  loadHighValueCustomers: false,
  inactiveUsers: [],
  highValueCustomers: [],

  fetchInactiveUsers: async (productId: string) => {
    try {
      set({ loadInactiveUsers: true });
      const result = await InactiveUsers(productId);
      if (result.success) set({ inactiveUsers: result.users });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadInactiveUsers: false });
    }
  },

  fetchHighValueCustomers: async () => {
    try {
      set({ loadHighValueCustomers: true });
      const result = await HighValueCustomers();
      if (result.success) set({ highValueCustomers: result.users });
    } catch (error) {
      console.error(error);
    } finally {
      set({ loadHighValueCustomers: false });
    }
  },

  sendEmail: async (
    productId: string,
    userIds: string[],
    campaignType: "inactive" | "highValue"
  ) => {
    const res = await SendCampaignEmail({ productId, userIds, campaignType });
    if (res.success) {
      toast.success(res.message || "Emails sent!");
    } else {
      toast.error(res.error || "Something went wrong");
    }
  },
}));

export default useCampaignStore;
