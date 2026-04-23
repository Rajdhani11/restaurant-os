import { supabase } from "./supabase";
import { db } from "./offline";

export async function syncToCloud(table, data) {
  try {
    const { error } = await supabase.from(table).insert(data);
    if (error) throw error;
    return true;
  } catch (err) {
    const offline = (await db.get("offline_queue")) || [];
    offline.push({ table, data, timestamp: Date.now() });
    await db.save("offline_queue", offline);
    return false;
  }
}