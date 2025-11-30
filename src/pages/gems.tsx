import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import {
  getGemsByTab,
  addGem,
  updateGem,
  deleteGem,
  type GemItem,
} from "@/services/gemsService";
import { Tabs, type TabName } from "@/components/ui/tabs";

export default function GemsPage() {
  const [gems, setGems] = useState<GemItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<TabName>("Speed Ups");
  const [selectedGem, setSelectedGem] = useState<GemItem | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Add Item Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Edit Item Modal State
  const [editItemName, setEditItemName] = useState("");
  const [editQuantity, setEditQuantity] = useState("");

  // Fetch gems when activeTab changes
  useEffect(() => {
    const fetchGems = async () => {
      setLoading(true);
      try {
        const items = await getGemsByTab(activeTab);
        setGems(items);
      } catch (error) {
        console.error("Failed to fetch gems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGems();
  }, [activeTab]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const handleEdit = (gem: GemItem) => {
    setSelectedGem(gem);
    setEditItemName(gem.itemName);
    setEditQuantity(gem.quantity.toString());
    setShowEditModal(true);
  };

  const handleDelete = (gem: GemItem) => {
    setSelectedGem(gem);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGem) return;

    setSubmitting(true);
    try {
      await deleteGem(selectedGem.id);

      // Close modal
      setShowDeleteConfirm(false);
      setSelectedGem(null);

      // Refresh the list
      const items = await getGemsByTab(activeTab);
      setGems(items);
    } catch (error) {
      console.error("Failed to delete gem:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    setSelectedGem(null);
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemName.trim() || !quantity) {
      return;
    }

    setSubmitting(true);
    try {
      await addGem(itemName.trim(), Number(quantity), activeTab);

      // Reset form
      setItemName("");
      setQuantity("");
      setShowAddModal(false);

      // Refresh the list
      const items = await getGemsByTab(activeTab);
      setGems(items);
    } catch (error) {
      console.error("Failed to add gem:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setItemName("");
    setQuantity("");
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGem || !editItemName.trim() || !editQuantity) {
      return;
    }

    setSubmitting(true);
    try {
      await updateGem(
        selectedGem.id,
        editItemName.trim(),
        Number(editQuantity)
      );

      // Close modal
      setShowEditModal(false);
      setSelectedGem(null);
      setEditItemName("");
      setEditQuantity("");

      // Refresh the list
      const items = await getGemsByTab(activeTab);
      setGems(items);
    } catch (error) {
      console.error("Failed to update gem:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setSelectedGem(null);
    setEditItemName("");
    setEditQuantity("");
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gems Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage gems packages and pricing
          </p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto"
        >
          + Add Gems Package
        </Button>
      </div>

      {/* Tabs */}
      <Tabs onTabChange={setActiveTab} defaultTab={activeTab} />

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Total Packages", value: "24", icon: "📦" },
          { label: "Available", value: "18", icon: "✅" },
          { label: "Sold Today", value: "6", icon: "💰" },
          { label: "Revenue", value: "$1,240", icon: "💵" },
        ].map((stat, idx) => (
          <Card
            key={idx}
            className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-lg animate-in fade-in slide-in-from-top-4"
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <span className="text-4xl">{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gems Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">Loading gems...</p>
          </div>
        ) : gems.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">
              No gems found for this tab.
            </p>
          </div>
        ) : (
          gems.map((gem, idx) => (
            <Card
              key={gem.id}
              className="border-primary/20 hover:border-secondary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardHeader className="bg-gradient-to-br from-secondary/10 to-primary/10 pb-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-3xl">💎</span>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">
                        {gem.itemName}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">
                        Qty:{" "}
                        <span className="font-semibold">{gem.quantity}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {/* Tab Name Badge */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Category:
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                    {gem.tabName}
                  </span>
                </div>

                {/* Created Date */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {formatDate(gem.createdAt)}
                  </span>
                </div>

                {/* Image if available */}
                {gem.imageUrl && (
                  <div className="rounded-lg overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10">
                    <img
                      src={gem.imageUrl}
                      alt={gem.itemName}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-primary/50 hover:bg-primary/10"
                    onClick={() => handleEdit(gem)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-destructive/50 hover:bg-destructive/10 text-destructive"
                    onClick={() => handleDelete(gem)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Add Item Modal */}
      <Modal
        open={showAddModal}
        onClose={handleCloseAddModal}
        title="Add New Gem Item"
      >
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              type="text"
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="Enter quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              required
              disabled={submitting}
            />
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              Category:{" "}
              <span className="font-semibold text-foreground">{activeTab}</span>
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseAddModal}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              {submitting ? "Adding..." : "Add Item"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Item Modal */}
      <Modal
        open={showEditModal}
        onClose={handleCloseEditModal}
        title="Edit Gem Item"
      >
        <form onSubmit={handleUpdateItem} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="editItemName">Item Name</Label>
            <Input
              id="editItemName"
              type="text"
              placeholder="Enter item name"
              value={editItemName}
              onChange={(e) => setEditItemName(e.target.value)}
              required
              disabled={submitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="editQuantity">Quantity</Label>
            <Input
              id="editQuantity"
              type="number"
              placeholder="Enter quantity"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              min="1"
              required
              disabled={submitting}
            />
          </div>

          {selectedGem && (
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm text-muted-foreground">
                Category:{" "}
                <span className="font-semibold text-foreground">
                  {selectedGem.tabName}
                </span>
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseEditModal}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-gradient-to-r from-primary to-secondary"
            >
              {submitting ? "Updating..." : "Update Item"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={showDeleteConfirm}
        onClose={handleCloseDeleteConfirm}
        title="Delete Gem Item"
      >
        <div className="space-y-4">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
            <p className="text-sm text-foreground">
              Are you sure you want to delete this item?
            </p>
            {selectedGem && (
              <div className="mt-3 space-y-1">
                <p className="text-sm font-semibold">{selectedGem.itemName}</p>
                <p className="text-xs text-muted-foreground">
                  Quantity: {selectedGem.quantity} • Category:{" "}
                  {selectedGem.tabName}
                </p>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCloseDeleteConfirm}
              disabled={submitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleConfirmDelete}
              disabled={submitting}
              className="flex-1 bg-destructive hover:bg-destructive/90"
            >
              {submitting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
