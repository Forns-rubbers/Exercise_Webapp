import { supabase } from "./supabase.js";

export async function requireUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    window.location.replace("index.html");
    return null;
  }
  return user;
}

export async function updateMyProfile(changes) {
  const user = await requireUser();
  if (!user) return { error: new Error("Please sign in first") };
  return supabase.from("profiles").update(changes).eq("id", user.id);
}

export async function getMyMissionProgress() {
  const user = await requireUser();
  if (!user) return { data: null, error: new Error("Please sign in first") };
  return supabase.from("mission_progress").select("unlocked_level, completed_level").eq("user_id", user.id).single();
}

export async function signOut() {
  await supabase.auth.signOut();
  window.location.replace("index.html");
}
