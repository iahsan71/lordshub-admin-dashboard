import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  subscribeToAccounts,
  addAccount,
  updateAccount,
  deleteAccount,
  removeImageFromAccount,
} from "@/store/actions/accountsActions";
import { Account } from "@/store/slices/accountsSlice";

type AccountsPageProps = {
  type: 'restricted' | 'open';
};

export default function AccountsPage({ type }: AccountsPageProps) {
  const dispatch = useAppDispatch();
  const { accounts, loading, uploadingImages } = useAppSelector((state) => state.accounts);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Subscribe to accounts on mount
  useEffect(() => {
    const unsubscribe = dispatch(subscribeToAccounts());
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  // Filter accounts by type and search criteria
  const filteredAccounts = accounts.filter((acc) => {
    // Filter by type
    if (acc.type !== type) return false;
    
    const matchesSearch =
      acc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.productId.toLowerCase().includes(searchTerm.toLowerCase());

    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = acc.price >= min && acc.price <= max;

    return matchesSearch && matchesPrice;
  });

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages((prev) => [...prev, ...files]);

    // Create preview URLs
    const newPreviewUrls = files.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
  };

  // Remove selected image
  const removeSelectedImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Remove existing image
  const removeExistingImage = async (imageUrl: string) => {
    if (editingAccount) {
      try {
        const remaining = existingImages.filter((url) => url !== imageUrl);
        await dispatch(removeImageFromAccount(editingAccount.id, imageUrl, remaining));
        setExistingImages(remaining);
      } catch (error) {
        alert("Failed to remove image");
      }
    } else {
      setExistingImages((prev) => prev.filter((url) => url !== imageUrl));
    }
  };

  // Open add modal
  const openAddModal = () => {
    setEditingAccount(null);
    setFormData({ title: "", description: "", price: "" });
    setSelectedImages([]);
    setExistingImages([]);
    setPreviewUrls([]);
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      title: account.title,
      description: account.description,
      price: account.price.toString(),
    });
    setSelectedImages([]);
    setExistingImages(account.images);
    setPreviewUrls([]);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingAccount(null);
    setFormData({ title: "", description: "", price: "" });
    setSelectedImages([]);
    setExistingImages([]);
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price) {
      alert("Please fill in all fields");
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      alert("Please enter a valid price");
      return;
    }

    try {
      if (editingAccount) {
        // Update existing account
        await dispatch(
          updateAccount(editingAccount.id, editingAccount.productId, {
            title: formData.title,
            description: formData.description,
            price,
            newImages: selectedImages,
            existingImages,
            type: type,
          })
        );
      } else {
        // Add new account (Product ID will be auto-generated)
        await dispatch(
          addAccount({
            title: formData.title,
            description: formData.description,
            price,
            images: selectedImages,
            type: type,
          })
        );
      }
      closeModal();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save account");
    }
  };

  // Handle delete
  const handleDelete = async (account: Account) => {
    if (!confirm(`Are you sure you want to delete "${account.title}"?`)) return;

    try {
      await dispatch(deleteAccount(account.id, account.images));
    } catch (error) {
      alert("Failed to delete account");
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {type === 'restricted' ? 'Restricted Kingdom Accounts' : 'Open Kingdom Accounts'}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Manage {type === 'restricted' ? 'restricted' : 'open'} kingdom accounts inventory
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto"
        >
          + Add New {type === 'restricted' ? 'Restricted' : 'Open'} Account
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="pt-6">
          <div className="w-full">
            <div className="lg:col-span-2">
              <Label>Search</Label>
              <Input
                placeholder="Search by title, description, or product ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border"
              />
            </div>
           
          </div>
        </CardContent>
      </Card>

      {/* Accounts Grid */}
      {loading && accounts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading accounts...</p>
        </div>
      ) : filteredAccounts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No accounts found</p>
          {searchTerm || minPrice || maxPrice ? (
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setMinPrice("");
                setMaxPrice("");
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredAccounts.map((account, idx) => (
            <Card
              key={account.id}
              className="border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Image Gallery */}
              {account.images.length > 0 && (
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={account.images[0]}
                    alt={account.title}
                    className="w-full h-full object-cover"
                  />
                  {account.images.length > 1 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      +{account.images.length - 1} more
                    </div>
                  )}
                </div>
              )}

              <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{account.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">ID: {account.productId}</p>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        account.type === 'restricted' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                          : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {account.type === 'restricted' ? '🔒 Restricted' : '🔓 Open'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{account.description}</p>
                
                <div className="pt-3 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-secondary">${account.price}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-primary/50 hover:bg-primary/10"
                        onClick={() => openEditModal(account)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive/50 hover:bg-destructive/10 text-destructive"
                        onClick={() => handleDelete(account)}
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
              <CardTitle>{editingAccount ? "Edit Account" : "Add New Account"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {editingAccount && (
                  <div>
                    <Label>Product ID</Label>
                    <Input
                      value={editingAccount.productId}
                      disabled
                      className="bg-muted border-border cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Product ID is auto-generated and cannot be changed
                    </p>
                  </div>
                )}

                <div>
                  <Label htmlFor="title">Product Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Lords Mobile - Castle 25 Account"
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
                    placeholder="Detailed description of the account..."
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
                    placeholder="299.99"
                    className="bg-input border-border"
                    required
                  />
                </div>

                <div>
                  <Label>Images (Max 5MB each)</Label>
                  <Input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    multiple
                    onChange={handleImageSelect}
                    className="bg-input border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Supported formats: JPG, PNG, GIF, WEBP
                  </p>
                </div>

                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div>
                    <Label>Current Images</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {existingImages.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(url)}
                            className="absolute top-1 right-1 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Image Previews */}
                {previewUrls.length > 0 && (
                  <div>
                    <Label>New Images</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {previewUrls.map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded border"
                          />
                          <button
                            type="button"
                            onClick={() => removeSelectedImage(index)}
                            className="absolute top-1 right-1 bg-destructive text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    disabled={uploadingImages}
                  >
                    {uploadingImages
                      ? "Uploading..."
                      : editingAccount
                      ? "Update Account"
                      : "Add Account"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeModal}
                    disabled={uploadingImages}
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
