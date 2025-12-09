import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  subscribeToBlogs,
  addBlog,
  updateBlog,
  deleteBlog,
} from "@/store/actions/blogsActions";
import { Blog } from "@/store/slices/blogsSlice";
import RichTextEditor from "@/components/richTextEditor";

export default function BlogPage() {
  const dispatch = useAppDispatch();
  const { blogs, loading } = useAppSelector((state) => state.blogs);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageFile: null as File | null,
  });

  // Subscribe to blogs on mount
  useEffect(() => {
    const unsubscribe = dispatch(subscribeToBlogs());
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [dispatch]);

  // Filter blogs
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Open add modal
  const openAddModal = () => {
    setEditingBlog(null);
    setFormData({
      title: "",
      description: "",
      imageFile: null,
    });
    setShowModal(true);
  };

  // Open edit modal
  const openEditModal = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      description: blog.description,
      imageFile: null,
    });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setEditingBlog(null);
    setFormData({
      title: "",
      description: "",
      imageFile: null,
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imageFile: file });
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      return;
    }

    try {
      if (editingBlog) {
        // Update existing blog
        await dispatch(
          updateBlog(editingBlog.id, {
            title: formData.title,
            description: formData.description,
            imageFile: formData.imageFile || undefined,
            oldImageUrl: editingBlog.imageUrl,
          })
        );
      } else {
        // Add new blog
        await dispatch(
          addBlog({
            title: formData.title,
            description: formData.description,
            imageFile: formData.imageFile || undefined,
          })
        );
      }
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  // Handle delete
  const handleDelete = async (blog: Blog) => {
    if (!confirm(`Are you sure you want to delete "${blog.title}"?`)) return;

    try {
      await dispatch(deleteBlog(blog.id, blog.imageUrl));
    } catch (error) {
      console.error(error);
    }
  };

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Blog Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">
            Create and manage blog posts
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-gradient-to-r from-primary to-secondary hover:shadow-lg transition-all w-full sm:w-auto"
        >
          + Add Blog Post
        </Button>
      </div>

      {/* Search */}
      <Card className="border-primary/20 shadow-lg">
        <CardContent className="pt-6">
          <div>
            <Label>Search</Label>
            <Input
              placeholder="Search by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-input border-border"
            />
          </div>
        </CardContent>
      </Card>

      {/* Blogs Grid */}
      {loading && blogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading blog posts...</p>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blog posts found</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filteredBlogs.map((blog, idx) => (
            <Card
              key={blog.id}
              className="border-secondary/20 hover:border-secondary/50 transition-all hover:shadow-xl hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <CardHeader className="bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">📝</span>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{blog.title}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {blog.createdAt?.toDate?.()?.toLocaleDateString() || ""}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {/* Image Preview */}
                {blog.imageUrl && (
                  <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="text-sm text-muted-foreground line-clamp-3">
                  {stripHtml(blog.description)}
                </div>

                <div className="pt-3 border-t border-border">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-primary/50 hover:bg-primary/10"
                      onClick={() => openEditModal(blog)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-destructive/50 hover:bg-destructive/10 text-destructive"
                      onClick={() => handleDelete(blog)}
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
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingBlog ? "Edit Blog Post" : "Add New Blog Post"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Blog Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g., Getting Started with React"
                    className="bg-input border-border"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">Featured Image</Label>
                  <Input
                    id="image"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="bg-input border-border"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {editingBlog
                      ? "Leave empty to keep current image. Upload new file to replace."
                      : "Upload a featured image for this blog post (optional)"}
                  </p>
                  {formData.imageFile && (
                    <p className="text-xs text-primary mt-1">
                      Selected: {formData.imageFile.name}
                    </p>
                  )}
                </div>

                {editingBlog && editingBlog.imageUrl && (
                  <div>
                    <Label>Current Image</Label>
                    <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden mt-2">
                      <img
                        src={editingBlog.imageUrl}
                        alt={editingBlog.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="description">Blog Content *</Label>
                  <RichTextEditor
                    content={formData.description}
                    onChange={(html) =>
                      setFormData({ ...formData, description: html })
                    }
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use the toolbar to format your blog content with bold, italic, headings, lists, and more
                  </p>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary"
                    disabled={loading}
                  >
                    {loading
                      ? "Saving..."
                      : editingBlog
                      ? "Update Blog Post"
                      : "Add Blog Post"}
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
