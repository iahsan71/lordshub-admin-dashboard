import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  subscribeToOffers,
  addOffer,
  updateOffer,
  deleteOffer,
} from "@/store/actions/offersActions";
import { Offer } from "@/store/slices/offersSlice";

export default function OffersPage() {
  const dispatch = useAppDispatch();
  const { offers, loading } = useAppSelector((state) => state.offers);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mediaFile: null as File | null,
    mediaType: "image" as "image" | "video",
  });

  // Subscribe to offers on mount
  useEffect(() => {
    const unsubscribe = dispatch(subscribeToOffers());
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  // Filter offers
  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.productId.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Open add modal
  const openAddModal = () => {
    setEditingOffer(null);
    setFormData({ name: "", description: "", mediaFile: null, mediaType: "image" });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      name: offer.name,
      description: offer.description,
      mediaFile: null,
      mediaType: offer.mediaType,
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingOffer(null);
    setFormData({ name: "", description: "", mediaFile: null, mediaType: "image" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Detect media type
      const type = file.type.startsWith("video/") ? "video" : "image";
      setFormData({ ...formData, mediaFile: file, mediaType: type });
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      alert("Please fill in all fields");
      return;
    }

    if (!editingOffer && !formData.mediaFile) {
      alert("Please select a media file");
      return;
    }

    try {
      if (editingOffer) {
        // Update existing offer
        await dispatch(
          updateOffer(editingOffer.id, editingOffer.productId, {
            name: formData.name,
            description: formData.description,
            mediaFile: formData.mediaFile || undefined,
            mediaType: formData.mediaType,
            oldMediaUrl: editingOffer.mediaUrl,
          })
        );
      } else {
        // Add new offer
        await dispatch(
          addOffer({
            name: formData.name,
            description: formData.description,
            mediaFile: formData.mediaFile!,
            mediaType: formData.mediaType,
          })
        );
      }
      closeModal();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save offer");
    }
  };

  // Handle delete
  const handleDelete = async (offer: Offer) => {
    if (!confirm(`Are you sure you want to delete "${offer.name}"?`)) return;

    try {
      await dispatch(deleteOffer(offer.id, offer.mediaUrl));
    } catch (error) {
      alert("Failed to delete offer");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Offers Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage special offers and promotions</p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto"
        >
          + Add Offer
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

      {/* Offers Grid */}
      {loading && offers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading offers...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No offers found</p>
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
          {filteredOffers.map((offer, idx) => (
            <Card
              key={offer.id}
              className="border-secondary/20 hover:border-secondary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">🎁</span>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{offer.name}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">ID: {offer.productId}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {/* Media Preview */}
                <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                  {offer.mediaType === "video" ? (
                    <video
                      src={offer.mediaUrl}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={offer.mediaUrl}
                      alt={offer.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{offer.description}</p>
                
                <div className="pt-3 border-t border-border">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/50 hover:bg-primary/10"
                      onClick={() => openEditModal(offer)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-destructive/50 hover:bg-destructive/10 text-destructive"
                      onClick={() => handleDelete(offer)}
                    >
                      Delete
                    </Button>
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
              <CardTitle>{editingOffer ? "Edit Offer" : "Add New Offer"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {editingOffer && (
                  <div>
                    <Label>Product ID</Label>
                    <Input
                      value={editingOffer.productId}
                      disabled
                      className="bg-muted border-border cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Product ID is auto-generated and cannot be changed
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="name">Offer Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Black Friday Sale"
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
                    placeholder="Detailed description of the offer..."
                    className="w-full min-h-[100px] rounded-md border border-border bg-input px-3 py-2 text-foreground resize-y"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="media">Media (Image/Video) {!editingOffer && "*"}</Label>
                  <Input
                    id="media"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="bg-input border-border"
                    required={!editingOffer}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {editingOffer
                      ? "Leave empty to keep current media. Upload new file to replace."
                      : "Upload an image or video for this offer"}
                  </p>
                  {formData.mediaFile && (
                    <p className="text-xs text-primary mt-1">
                      Selected: {formData.mediaFile.name} ({formData.mediaType})
                    </p>
                  )}
                </div>

                {editingOffer && (
                  <div>
                    <Label>Current Media</Label>
                    <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden mt-2">
                      {editingOffer.mediaType === "video" ? (
                        <video
                          src={editingOffer.mediaUrl}
                          className="w-full h-full object-cover"
                          controls
                        />
                      ) : (
                        <img
                          src={editingOffer.mediaUrl}
                          alt={editingOffer.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingOffer
                      ? "Update Offer"
                      : "Add Offer"}
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
