import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  subscribeToBots,
  addBot,
  updateBot,
  deleteBot,
} from "@/store/actions/botsActions";
import { Bot } from "@/store/slices/botsSlice";

type BotsPageProps = {
  type: 'war' | 'rein' | 'kvk' | 'farm';
};

const botTypeLabels = {
  war: 'War Bots',
  rein: 'Rein Bots',
  kvk: 'KVK Bots',
  farm: 'Farm/Bank Bots',
};

export default function BotsPage({ type }: BotsPageProps) {
  const dispatch = useAppDispatch();
  const { bots, loading } = useAppSelector((state) => state.bots);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBot, setEditingBot] = useState<Bot | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    features: [""],
  });

  // Subscribe to bots on mount
  useEffect(() => {
    const unsubscribe = dispatch(subscribeToBots());
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  // Filter bots by type and search
  const filteredBots = bots.filter((bot) => {
    if (bot.type !== type) return false;
    
    const matchesSearch =
      bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bot.productId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Open add modal
  const openAddModal = () => {
    setEditingBot(null);
    setFormData({ name: "", description: "", price: "", features: [""] });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (bot: Bot) => {
    setEditingBot(bot);
    setFormData({
      name: bot.name,
      description: bot.description,
      price: bot.price.toString(),
      features: bot.features.length > 0 ? bot.features : [""],
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingBot(null);
    setFormData({ name: "", description: "", price: "", features: [""] });
  };

  // Handle feature change
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  // Add feature field
  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  // Remove feature field
  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const newFeatures = formData.features.filter((_, i) => i !== index);
      setFormData({ ...formData, features: newFeatures });
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description || !formData.price) {
      alert("Please fill in all required fields");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    // Filter out empty features
    const features = formData.features.filter(f => f.trim() !== "");
    if (features.length === 0) {
      alert("Please add at least one feature");
      return;
    }

    try {
      if (editingBot) {
        // Update existing bot
        await dispatch(
          updateBot(editingBot.id, editingBot.productId, {
            name: formData.name,
            description: formData.description,
            price,
            features,
            type: type,
          })
        );
      } else {
        // Add new bot
        await dispatch(
          addBot({
            name: formData.name,
            description: formData.description,
            price,
            features,
            type: type,
          })
        );
      }
      closeModal();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save bot");
    }
  };

  // Handle delete
  const handleDelete = async (bot: Bot) => {
    if (!confirm(`Are you sure you want to delete "${bot.name}"?`)) return;

    try {
      await dispatch(deleteBot(bot.id));
    } catch (error) {
      alert("Failed to delete bot");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {botTypeLabels[type]}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage {botTypeLabels[type].toLowerCase()} services
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto"
        >
          + Add New Bot
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

      {/* Bots Grid */}
      {loading && bots.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading bots...</p>
        </div>
      ) : filteredBots.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No bots found</p>
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
          {filteredBots.map((bot, idx) => (
            <Card
              key={bot.id}
              className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🤖</span>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{bot.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">ID: {bot.productId}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{bot.description}</p>
                
                {bot.features.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">Features:</p>
                    <ul className="space-y-1">
                      {bot.features.map((feature, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span className="flex-1">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-secondary">${bot.price}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/50 hover:bg-primary/10"
                        onClick={() => openEditModal(bot)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/50 hover:bg-destructive/10 text-destructive"
                        onClick={() => handleDelete(bot)}
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
              <CardTitle>{editingBot ? "Edit Bot" : "Add New Bot"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {editingBot && (
                  <div>
                    <Label>Product ID</Label>
                    <Input
                      value={editingBot.productId}
                      disabled
                      className="bg-muted border-border cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Product ID is auto-generated and cannot be changed
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="name">Bot Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Advanced War Bot Pro"
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
                    placeholder="Detailed description of the bot service..."
                    className="w-full min-h-[100px] rounded-md border border-border bg-input px-3 py-2 text-foreground resize-y"
                    required
                  />
                </div>

                <div>
                  <Label>Features *</Label>
                  <div className="space-y-2 mt-2">
                    {formData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder={`Feature ${index + 1}`}
                          className="bg-input border-border flex-1"
                        />
                        {formData.features.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeFeature(index)}
                            className="border-destructive/50 hover:bg-destructive/10 text-destructive"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addFeature}
                      className="w-full"
                    >
                      + Add Feature
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">Price (USD) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="29.99"
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
                      : editingBot
                      ? "Update Bot"
                      : "Add Bot"}
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
