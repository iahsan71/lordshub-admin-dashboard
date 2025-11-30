import { useState, useEffect } from "react";
import { Modal } from "../components/ui/modal";
import {
  getSocialMediaLinks,
  addSocialMediaLink,
  updateSocialMediaLink,
  deleteSocialMediaLink,
  SocialMediaLink,
} from "../services/socialMediaLinksService";

export default function SocialMediaLinksPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [errors, setErrors] = useState({ platform: "", url: "" });
  const [links, setLinks] = useState<SocialMediaLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const platforms = [
    "Facebook",
    "Instagram",
    "Discord",
    "Telegram",
    "Twitter",
    "WhatsApp",
    "Line",
    "Email",
  ];

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      setLoading(true);
      const data = await getSocialMediaLinks();
      setLinks(data);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to fetch social media links");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setEditingId(null);
  };

  const handleEditModal = (link: SocialMediaLink) => {
    setSelectedPlatform(link.platform);
    setUrl(link.url);
    setEditingId(link.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlatform("");
    setUrl("");
    setErrors({ platform: "", url: "" });
    setEditingId(null);
  };

  const validateForm = () => {
    const newErrors = { platform: "", url: "" };
    let isValid = true;

    if (!selectedPlatform) {
      newErrors.platform = "Platform is required";
      isValid = false;
    }

    if (!url) {
      newErrors.url = "URL is required";
      isValid = false;
    } else if (!url.startsWith("http://") && !url.startsWith("https://")) {
      newErrors.url = "URL must start with http:// or https://";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const payload = { platform: selectedPlatform, url };

      if (editingId) {
        await updateSocialMediaLink(editingId, payload);
        alert("Social media link updated successfully");
      } else {
        await addSocialMediaLink(payload);
        alert("Social media link added successfully");
      }

      await fetchLinks();
      handleCloseModal();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to save social media link");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this social media link?")) {
      return;
    }

    try {
      await deleteSocialMediaLink(id);
      alert("Social media link deleted successfully");
      await fetchLinks();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete social media link");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString();
  };

  const isFormValid =
    selectedPlatform && url && (url.startsWith("http://") || url.startsWith("https://"));

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Social Media Links</h1>
        <button
          onClick={handleOpenModal}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Add Social Media Link
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <div className="bg-card rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Platform</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">URL</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {links.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                    No social media links found. Add one to get started.
                  </td>
                </tr>
              ) : (
                links.map((link) => (
                  <tr key={link.id} className="border-t border-border">
                    <td className="px-6 py-4">{link.platform}</td>
                    <td className="px-6 py-4">
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {link.url}
                      </a>
                    </td>
                    <td className="px-6 py-4">{formatDate(link.createdAt)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleEditModal(link)}
                        className="text-blue-600 hover:text-blue-800 mr-3"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        title={editingId ? "Edit Social Media Link" : "Add Social Media Link"}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Platform</label>
            <select
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md bg-background ${
                errors.platform ? "border-red-500" : "border-border"
              }`}
            >
              <option value="">Select a platform</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            {errors.platform && (
              <p className="text-red-500 text-sm mt-1">{errors.platform}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">URL</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL"
              className={`w-full px-3 py-2 border rounded-md bg-background ${
                errors.url ? "border-red-500" : "border-border"
              }`}
            />
            {errors.url && (
              <p className="text-red-500 text-sm mt-1">{errors.url}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={handleCloseModal}
              disabled={submitting}
              className="px-4 py-2 border border-border rounded-md hover:bg-muted transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || submitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Saving..." : editingId ? "Update" : "Submit"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
