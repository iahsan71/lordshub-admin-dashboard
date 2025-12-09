import { AppDispatch } from "../index";
import {
  setBlogs,
  addBlog as addBlogToState,
  updateBlog as updateBlogInState,
  deleteBlog as deleteBlogFromState,
  setLoading,
  setError,
  Blog,
} from "../slices/blogsSlice";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "@/config/firebase";
import { toast } from "react-toastify";

// Real-time listener for all blogs
export const subscribeToBlogs = () => (dispatch: AppDispatch) => {
  const blogsRef = collection(db, "blogs");
  const q = query(blogsRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(
    q,
    (snapshot) => {
      const blogs: Blog[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Blog[];
      dispatch(setBlogs(blogs));
      dispatch(setLoading(false));
    },
    (error) => {
      console.error("Error fetching blogs:", error);
      dispatch(setError("Failed to load blogs"));
      dispatch(setLoading(false));
    }
  );

  return unsubscribe;
};

// Upload image file to Firebase Storage
const uploadImage = async (file: File, blogId: string): Promise<string> => {
  const fileExtension = file.name.split(".").pop();
  const fileName = `blogs/${blogId}.${fileExtension}`;
  const storageRef = ref(storage, fileName);

  await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(storageRef);

  return downloadURL;
};

// Delete image file from Firebase Storage
const deleteImage = async (imageUrl: string): Promise<void> => {
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
  } catch (error) {
    console.error("Error deleting image:", error);
  }
};

// Add new blog
export const addBlog =
  (data: {
    title: string;
    description: string;
    imageFile?: File;
  }) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Add blog to Firestore
      const blogsRef = collection(db, "blogs");
      const docRef = await addDoc(blogsRef, {
        title: data.title,
        description: data.description,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Upload image if provided
      if (data.imageFile) {
        const imageUrl = await uploadImage(data.imageFile, docRef.id);
        await updateDoc(docRef, { imageUrl });
      }

      dispatch(setLoading(false));
      toast.success("Blog post added");
      return docRef.id;
    } catch (error) {
      console.error("Error adding blog:", error);
      dispatch(setLoading(false));

      let errorMessage = "Failed to add blog post";
      if (error instanceof Error) {
        if (
          error.message.includes("permission-denied") ||
          error.message.includes("Missing or insufficient permissions")
        ) {
          errorMessage =
            "Permission denied. Please ensure Firestore and Storage rules are set up correctly.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    }
  };

// Update existing blog
export const updateBlog =
  (
    blogId: string,
    data: {
      title: string;
      description: string;
      imageFile?: File;
      oldImageUrl?: string;
    }
  ) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      let imageUrl = data.oldImageUrl;

      // If new image file is provided, upload it and delete old one
      if (data.imageFile) {
        imageUrl = await uploadImage(data.imageFile, blogId);
        if (data.oldImageUrl) {
          await deleteImage(data.oldImageUrl);
        }
      }

      // Update blog in Firestore
      const blogRef = doc(db, "blogs", blogId);
      await updateDoc(blogRef, {
        title: data.title,
        description: data.description,
        imageUrl,
        updatedAt: serverTimestamp(),
      });

      dispatch(setLoading(false));
      toast.success("Blog post updated");
    } catch (error) {
      console.error("Error updating blog:", error);
      dispatch(setLoading(false));

      let errorMessage = "Failed to update blog post";
      if (error instanceof Error) {
        if (
          error.message.includes("permission-denied") ||
          error.message.includes("Missing or insufficient permissions")
        ) {
          errorMessage =
            "Permission denied. Please ensure Firestore and Storage rules are set up correctly.";
        } else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
      dispatch(setError(errorMessage));
      throw new Error(errorMessage);
    }
  };

// Delete blog
export const deleteBlog =
  (blogId: string, imageUrl?: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(setLoading(true));

      // Delete image from storage if exists
      if (imageUrl) {
        await deleteImage(imageUrl);
      }

      // Delete blog from Firestore
      const blogRef = doc(db, "blogs", blogId);
      await deleteDoc(blogRef);

      dispatch(deleteBlogFromState(blogId));
      dispatch(setLoading(false));
      toast.success("Blog post deleted");
    } catch (error) {
      console.error("Error deleting blog:", error);
      dispatch(setLoading(false));
      const message =
        error instanceof Error ? error.message : "Failed to delete blog post";
      toast.error(message);
      dispatch(setError(message));
      throw error;
    }
  };
