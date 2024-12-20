import { configureSyncedSupabase } from '@legendapp/state/sync-plugins/supabase';

// utils
import * as Crypto from 'expo-crypto';

// provide a function to generate ids locally
export const generateId = () => Crypto.randomUUID();

// pass the generateId function to the syncedSupabase plugin
configureSyncedSupabase({ generateId });
