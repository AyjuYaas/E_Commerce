"use client";
import { useState, useEffect } from "react";
import useProductStore from "../store/useProductStore";
import useCampaignStore from "../store/useCampaignStore";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CampaignPage() {
  const [selectedProduct, setSelectedProduct] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState<"inactive" | "highValue">(
    "inactive"
  );

  const loading = useProductStore((state) => state.loading);
  const products = useProductStore((state) => state.products);

  const {
    loadInactiveUsers,
    loadHighValueCustomers,
    inactiveUsers,
    highValueCustomers,
    fetchInactiveUsers,
    fetchHighValueCustomers,
    sendEmail,
  } = useCampaignStore();

  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
    fetchHighValueCustomers();
  }, [fetchProducts, fetchHighValueCustomers]);

  useEffect(() => {
    if (selectedProduct && activeTab === "inactive") {
      fetchInactiveUsers(selectedProduct);
    }
  }, [fetchInactiveUsers, selectedProduct, activeTab]);

  const selectedProductName =
    products.find((p) => p.id === selectedProduct)?.name || "";

  const currentUsers =
    activeTab === "inactive" ? inactiveUsers : highValueCustomers;
  const currentLoading =
    activeTab === "inactive" ? loadInactiveUsers : loadHighValueCustomers;

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Mail className="w-6 h-6" />
            Email Campaign
          </CardTitle>
          <CardDescription>
            Send targeted emails to different customer segments
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-6">
            <div className="grid gap-2">
              <label className="text-sm font-medium leading-none">
                Choose Product
              </label>
              <Select
                value={selectedProduct}
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {loading ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">
                      Loading products...
                    </div>
                  ) : (
                    products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={(v) => setActiveTab(v as "inactive" | "highValue")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="inactive">Inactive Users</TabsTrigger>
                <TabsTrigger value="highValue">
                  High Value Customers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inactive">
                {selectedProduct && (
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold">
                        Inactive Users for{" "}
                        <Badge variant="outline">{selectedProductName}</Badge>
                      </h2>
                      <span className="text-sm text-muted-foreground">
                        {inactiveUsers.length} users found
                      </span>
                    </div>
                    <UserList
                      users={inactiveUsers}
                      loading={loadInactiveUsers}
                      segmentType="inactive"
                    />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="highValue">
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">
                      High Value Customers
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {highValueCustomers.length} users found
                    </span>
                  </div>
                  <UserList
                    users={highValueCustomers}
                    loading={loadHighValueCustomers}
                    segmentType="highValue"
                  />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>

        {currentUsers.length > 0 && selectedProduct && (
          <CardFooter className="flex justify-end border-t pt-4">
            <Button
              onClick={() =>
                sendEmail(
                  selectedProduct,
                  currentUsers.map((u) => u.id),
                  activeTab
                )
              }
              className="gap-2"
              disabled={currentLoading}
            >
              <Mail className="w-4 h-4" />
              Send {activeTab === "inactive"
                ? "Reactivation"
                : "Exclusive"}{" "}
              Offer
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  );
}

function UserList({
  users,
  loading,
  segmentType,
}: {
  users: { id: string; name: string; email: string }[];
  loading: boolean;
  segmentType: "inactive" | "highValue";
}) {
  return (
    <ScrollArea className="h-72 rounded-md border">
      <div className="p-4 space-y-3">
        {loading ? (
          <p className="text-center text-muted-foreground py-8">
            Loading users...
          </p>
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant="secondary">
                {segmentType === "inactive" ? "Inactive" : "VIP"}
              </Badge>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground py-8">
            No users found in this segment
          </p>
        )}
      </div>
    </ScrollArea>
  );
}
