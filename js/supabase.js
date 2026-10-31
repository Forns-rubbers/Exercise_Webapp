
import { createClient } from
    "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://ztkoqqshhperudnhkskq.supabase.co";

// Publishable keys are intended for browser use; protect data with RLS policies.
const SUPABASE_KEY = "sb_publishable_xKI3OmMmN9L4_UGjYJ8V-w_Qv7UUu-a";

export const supabase = createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
