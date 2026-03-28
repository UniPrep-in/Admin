import { create } from "zustand";
import { createClient } from "../app/lib/supabase/client";


const MAX_FILE_SIZE = 2 * 1024 * 1024;
interface ProfileState {
  fullName: string;
  imageUrl:string
  phone: string;
  address: string;
    imageError: string | null;
  file: File | null;
  loading: boolean;

  setFullName: (value: string) => void;
  setPhone: (value: string) => void;
  setAddress: (value: string) => void;
  setFile: (file: File | null) => void;

  saveProfile: () => Promise<boolean>;
    fetchProfile: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  fullName: "",
  imageUrl:"",
  phone: "",
  imageError:"",
  address: "",
  file: null,
  loading: false,

  setFullName: (value) => set({ fullName: value }),
  setPhone: (value) => set({ phone: value }),
  setAddress: (value) => set({ address: value }),
setFile: (file) => {
  if (!file) {
    set({ file: null, imageError: null });
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    set({
      file: null,
      imageError: "Image must be less than 2MB",
    });
  } else {
    set({
      file,
      imageError: null,
    });
  }
},

saveProfile: async (): Promise<boolean> => {
  const supabase = createClient();
  const { fullName, phone, address, file, imageError } = get();

  if (!fullName || !phone || !address || !file || imageError) {
    alert("Please fix errors before submitting");
    return false;
  }

  set({ loading: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    alert("User not authenticated");
    set({ loading: false });
    return false;
  }

  const filePath = `${user.id}/avatar`;

  await supabase.storage.from("avatars").remove([filePath]);

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadError) {
    alert(uploadError.message);
    set({ loading: false });
    return false;
  }

  const { data } = await supabase.storage
    .from("avatars")
    .createSignedUrl(filePath, 3600);

  const avatarUrl = data?.signedUrl;
const email= user.user_metadata?.email
   await supabase.auth.updateUser({
      email,
      data: {
        display_name: fullName,
      },
    });
  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    phone,
    address,
    is_admin:true,
    avatar_url: avatarUrl,
  });

  set({ loading: false });

  if (error) {
    alert(error.message);
    return false;
  }

  alert("Profile updated successfully!");

  set({
    fullName: "",
    phone: "",
    address: "",
    file: null,
  });

  return true;
},





    fetchProfile: async () => {
    const supabase = createClient();
    set({ loading: true });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      set({ loading: false });
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!error && data) {
        console.log(data);
        
      set({
        fullName: user.user_metadata?.display_name,
        phone: data.phone,
        address: data.address,
        imageUrl: data.avatar_url,
      });
    }

    set({ loading: false });
  },
}));
