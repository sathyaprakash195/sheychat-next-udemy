import firebaseApp from "@/config/firebase-config";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";

export const UploadImageToFirebaseAndReturnUrl = async (file: File) => {
  try {
    const storage = getStorage(firebaseApp);
    const storageRef = ref(storage, "images" + "/" + file.name);
    const uploadedImageResponse = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(uploadedImageResponse.ref);
    return downloadURL;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
