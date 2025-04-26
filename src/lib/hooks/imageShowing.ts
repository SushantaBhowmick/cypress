import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";


export const ImageShowing = (path:string,bucket:string) => {
    const supabase = createClientComponentClient();
    return supabase.storage.from(bucket).getPublicUrl(path)?.data.publicUrl;
};