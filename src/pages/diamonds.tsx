import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  subscribeToDiamonds,
  addDiamond,
  updateDiamond,
  deleteDiamond,
} from "@/store/actions/diamondsActions";
import { Diamond } from "@/store/slices/diamondsSlice";

export default function DiamondsPage() {
  const dispatch = useAppDispatch();
  const { diamonds, loading } = useAppSelector((state) => state.diamonds);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingDiamond, setEditingDiamond] = useState<Diamond | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  // Subscribe to diamonds on mount
  useEffect(() => {
    const unsubscribe = dispatch(subscribeToDiamonds());
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  // Filter diamonds
  const filteredDiamonds = diamonds.filter((diamond) => {
    const matchesSearch =
      diamond.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diamond.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diamond.productId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Open add modal
  const openAddModal = () => {
    setEditingDiamond(null);
    setFormData({ name: "", description: "", price: "" });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (diamond: Diamond) => {
    setEditingDiamond(diamond);
    setFormData({
      name: diamond.name,
      description: diamond.description,
      price: diamond.price.toString(),
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingDiamond(null);
    setFormData({ name: "", description: "", price: "" });
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      alert("Please fill in all fields");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      if (editingDiamond) {
        // Update existing diamond
        await dispatch(
          updateDiamond(editingDiamond.id, editingDiamond.productId, {
            name: formData.name,
            description: formData.description,
            price,
          })
        );
      } else {
        // Add new diamond
        await dispatch(
          addDiamond({
            name: formData.name,
            description: formData.description,
            price,
          })
        );
      }
      closeModal();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save diamond");
    }
  };

  // Handle delete
  const handleDelete = async (diamond: Diamond) => {
    if (!confirm(`Are you sure you want to delete "${diamond.name}"?`)) return;

    try {
      await dispatch(deleteDiamond(diamond.id));
    } catch (error) {
      alert("Failed to delete diamond");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Diamonds Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage diamonds packages</p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto"
        >
          + Add Diamonds Package
        </Button>
      </div>

      {/* Search */}
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="pt-6">
          <div>
            <Label>Search</Label>
            <Input
              placeholder="Search by name, description, or product ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-input border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Diamonds Grid */}
      {loading && diamonds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading diamonds...</p>
        </div>
      ) : filteredDiamonds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No diamonds found</p>
          {searchTerm ? (
            <Button
              variant="outline"
              onClick={() => setSearchTerm("")}
              className="mt-4"
            >
              Clear Search
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredDiamonds.map((diamond, idx) => (
            <Card
              key={diamond.id}
              className="border-secondary/20 hover:border-secondary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">💎</span>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{diamond.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">ID: {diamond.productId}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{diamond.description}</p>
                
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-secondary">${diamond.price}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/50 hover:bg-primary/10"
                        onClick={() => openEditModal(diamond)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/50 hover:bg-destructive/10 text-destructive"
                        onClick={() => handleDelete(diamond)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>{editingDiamond ? "Edit Diamond Package" : "Add New Diamond Package"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {editingDiamond && (
                  <div>
                    <Label>Product ID</Label>
                    <Input
                      value={editingDiamond.productId}
                      disabled
                      className="bg-muted border-border cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Product ID is auto-generated and cannot be changed
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., 1000 Diamonds Package"
                    className="bg-input border-border"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Detailed description of the diamond package..."
                    className="w-full min-h-[100px] rounded-md border border-border bg-input px-3 py-2 text-foreground resize-y"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="49.99"
                    className="bg-input border-border"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingDiamond
                      ? "Update Diamond"
                      : "Add Diamond"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
