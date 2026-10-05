import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Vehicle, TransportService, ServiceArea, QuoteRequest, ContactMessage, AdminStats } from '../types/index.ts';
import { INITIAL_VEHICLES, INITIAL_SERVICES, INITIAL_AREAS } from '../data/initialData.ts';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseUrl.startsWith('http') && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// API Base URL (Express server mounted on same port)
const API_URL = '/api';

/**
 * Unified Vehicles API
 */
export async function getVehicles(includeInactive = false): Promise<Vehicle[]> {
  try {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('vehicles').select('*').order('display_order', { ascending: true });
      if (!includeInactive) {
        query = query.eq('active', true);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as Vehicle[];
    }
  } catch (err) {
    console.warn('Supabase getVehicles failed, falling back to server API', err);
  }

  // Fallback to Express backend
  try {
    const res = await fetch(`${API_URL}/vehicles?all=${includeInactive}`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Server getVehicles error', err);
  }

  return INITIAL_VEHICLES;
}

export async function saveVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
  const res = await fetch(`${API_URL}/vehicles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(vehicle),
  });
  if (!res.ok) throw new Error('Failed to save vehicle');
  const saved = await res.json();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('vehicles').upsert([saved]);
    } catch (e) {
      console.warn('Supabase vehicle sync warning', e);
    }
  }
  return saved;
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
  const res = await fetch(`${API_URL}/vehicles/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update vehicle');
  const updated = await res.json();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('vehicles').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase vehicle update warning', e);
    }
  }
  return updated;
}

export async function deleteVehicle(id: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/vehicles/${id}`, { method: 'DELETE' });
  if (res.ok && isSupabaseConfigured && supabase) {
    try {
      await supabase.from('vehicles').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase vehicle delete warning', e);
    }
  }
  return res.ok;
}

/**
 * Unified Services API
 */
export async function getServices(includeInactive = false): Promise<TransportService[]> {
  try {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('services').select('*').order('display_order', { ascending: true });
      if (!includeInactive) query = query.eq('active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as TransportService[];
    }
  } catch (err) {
    console.warn('Supabase getServices fallback', err);
  }

  try {
    const res = await fetch(`${API_URL}/services?all=${includeInactive}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.error('Server getServices error', err);
  }

  return INITIAL_SERVICES;
}

export async function updateService(id: string, updates: Partial<TransportService>): Promise<TransportService> {
  const res = await fetch(`${API_URL}/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update service');
  return await res.json();
}

/**
 * Unified Service Areas API
 */
export async function getServiceAreas(includeInactive = false): Promise<ServiceArea[]> {
  try {
    if (isSupabaseConfigured && supabase) {
      let query = supabase.from('service_areas').select('*').order('name', { ascending: true });
      if (!includeInactive) query = query.eq('active', true);
      const { data, error } = await query;
      if (!error && data && data.length > 0) return data as ServiceArea[];
    }
  } catch (err) {
    console.warn('Supabase getServiceAreas fallback', err);
  }

  try {
    const res = await fetch(`${API_URL}/areas?all=${includeInactive}`);
    if (res.ok) return await res.json();
  } catch (err) {
    console.error('Server getServiceAreas error', err);
  }

  return INITIAL_AREAS;
}

export async function saveServiceArea(area: Partial<ServiceArea>): Promise<ServiceArea> {
  const res = await fetch(`${API_URL}/areas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(area),
  });
  if (!res.ok) throw new Error('Failed to save service area');
  return await res.json();
}

export async function updateServiceArea(id: string, updates: Partial<ServiceArea>): Promise<ServiceArea> {
  const res = await fetch(`${API_URL}/areas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update service area');
  return await res.json();
}

export async function deleteServiceArea(id: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/areas/${id}`, { method: 'DELETE' });
  return res.ok;
}

/**
 * Unified Quote Requests API
 */
export async function createQuoteRequest(quoteData: Omit<QuoteRequest, 'id' | 'reference_number' | 'created_at' | 'status'>): Promise<QuoteRequest> {
  // First persist in backend server
  const res = await fetch(`${API_URL}/quotes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(quoteData),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Failed to submit quote request. Please try again.');
  }

  const createdQuote: QuoteRequest = await res.json();

  // If Supabase is connected, mirror to Supabase PostgreSQL table
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('quote_requests').insert([createdQuote]);
    } catch (err) {
      console.warn('Supabase mirror quote failed (persisted in server DB):', err);
    }
  }

  return createdQuote;
}

export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  try {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('quote_requests').select('*').order('created_at', { ascending: false });
      if (!error && data) return data as QuoteRequest[];
    }
  } catch (err) {
    console.warn('Supabase getQuotes fallback', err);
  }

  const res = await fetch(`${API_URL}/quotes`);
  if (!res.ok) throw new Error('Failed to fetch quote requests');
  return await res.json();
}

export async function updateQuoteRequest(id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest> {
  const res = await fetch(`${API_URL}/quotes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update quote request');
  const updated = await res.json();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('quote_requests').update(updates).eq('id', id);
    } catch (e) {
      console.warn('Supabase updateQuote error', e);
    }
  }

  return updated;
}

export async function deleteQuoteRequest(id: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/quotes/${id}`, { method: 'DELETE' });
  if (res.ok && isSupabaseConfigured && supabase) {
    try {
      await supabase.from('quote_requests').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase deleteQuote error', e);
    }
  }
  return res.ok;
}

/**
 * Unified Contact Messages API
 */
export async function sendContactMessage(msg: { name: string; phone: string; email?: string; message: string }): Promise<ContactMessage> {
  const res = await fetch(`${API_URL}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(msg),
  });

  if (!res.ok) throw new Error('Failed to send contact message');
  const saved = await res.json();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('contact_messages').insert([saved]);
    } catch (e) {
      console.warn('Supabase contact message sync error', e);
    }
  }

  return saved;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const res = await fetch(`${API_URL}/messages`);
  if (!res.ok) throw new Error('Failed to fetch contact messages');
  return await res.json();
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  const res = await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' });
  return res.ok;
}

/**
 * Admin Stats API
 */
export async function getAdminStats(): Promise<AdminStats> {
  const res = await fetch(`${API_URL}/admin/stats`);
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return await res.json();
}
