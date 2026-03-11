import { supabase } from './supabase';

export async function addProduct(product) {
  const { data, error } = await supabase.from('products').insert([product]).select();
  return { data, error };
}

export async function deleteProduct(id) {
  const { error } = await supabase.from('products').delete().eq('id', id);
  return { error };
}

export async function updateProduct(id, updates) {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
  return { data, error };
}
