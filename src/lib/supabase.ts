import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Vehicle, TransportService, ServiceArea, QuoteRequest, ContactMessage, AdminStats } from '../types/index.ts';
import { INITIAL_VEHICLES, INITIAL_SERVICES, INITIAL_AREAS, INITIAL_SAMPLE_QUOTES, INITIAL_MESSAGES } from '../data/initialData.ts';

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

// Helper for Local Storage Fallback when backend is offline
const getLocalItem = <T>(key: string, defaultValue: T): T => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

const setLocalItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage write error', e);
  }
};

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
      const data = await res.json();
      setLocalItem('dubai_transport_vehicles', data);
      return data;
    }
  } catch (err) {
    // Backend offline
  }

  // Fallback to local storage or initial data
  const local = getLocalItem<Vehicle[]>('dubai_transport_vehicles', INITIAL_VEHICLES);
  return includeInactive ? local : local.filter((v) => v.active);
}

export async function saveVehicle(vehicle: Partial<Vehicle>): Promise<Vehicle> {
  try {
    const res = await fetch(`${API_URL}/vehicles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(vehicle),
    });
    if (res.ok) {
      const saved = await res.json();
      const current = getLocalItem<Vehicle[]>('dubai_transport_vehicles', INITIAL_VEHICLES);
      const updated = current.map((v) => (v.id === saved.id ? saved : v));
      if (!current.some((v) => v.id === saved.id)) updated.push(saved);
      setLocalItem('dubai_transport_vehicles', updated);
      return saved;
    }
  } catch (err) {
    console.warn('Backend offline, saving vehicle locally');
  }

  // Local storage fallback
  const current = getLocalItem<Vehicle[]>('dubai_transport_vehicles', INITIAL_VEHICLES);
  const newV: Vehicle = {
    id: vehicle.id || 'v-' + Date.now(),
    vehicle_name: vehicle.vehicle_name || 'Commercial Vehicle',
    vehicle_type: vehicle.vehicle_type || 'truck',
    short_description: vehicle.short_description || '',
    capacity: vehicle.capacity || 'Standard',
    suitable_for: vehicle.suitable_for || '',
    image_url: vehicle.image_url || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7',
    availability_status: vehicle.availability_status || 'available',
    dimensions: vehicle.dimensions || 'Standard',
    payload_capacity: vehicle.payload_capacity || '1,000 kg',
    active: vehicle.active !== undefined ? vehicle.active : true,
    display_order: vehicle.display_order || current.length + 1,
  };
  const updated = current.map((v) => (v.id === newV.id ? newV : v));
  if (!current.some((v) => v.id === newV.id)) updated.push(newV);
  setLocalItem('dubai_transport_vehicles', updated);
  return newV;
}

export async function updateVehicle(id: string, updates: Partial<Vehicle>): Promise<Vehicle> {
  try {
    const res = await fetch(`${API_URL}/vehicles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      const current = getLocalItem<Vehicle[]>('dubai_transport_vehicles', INITIAL_VEHICLES);
      setLocalItem('dubai_transport_vehicles', current.map((v) => (v.id === id ? updated : v)));
      return updated;
    }
  } catch (err) {
    console.warn('Backend offline, updating vehicle locally');
  }

  const current = getLocalItem<Vehicle[]>('dubai_transport_vehicles', INITIAL_VEHICLES);
  const found = current.find((v) => v.id === id);
  const updated: Vehicle = found ? { ...found, ...updates } : ({ id, ...updates } as Vehicle);
  setLocalItem('dubai_transport_vehicles', current.map((v) => (v.id === id ? updated : v)));
  return updated;
}

export async function deleteVehicle(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/vehicles/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const current = getLocalItem<Vehicle[]>('dubai_transport_vehicles', INITIAL_VEHICLES);
      setLocalItem('dubai_transport_vehicles', current.filter((v) => v.id !== id));
      return true;
    }
  } catch (err) {
    console.warn('Backend offline, deleting vehicle locally');
  }

  const current = getLocalItem<Vehicle[]>('dubai_transport_vehicles', INITIAL_VEHICLES);
  setLocalItem('dubai_transport_vehicles', current.filter((v) => v.id !== id));
  return true;
}

/**
 * Unified Services API
 */
export async function getServices(includeInactive = false): Promise<TransportService[]> {
  try {
    const res = await fetch(`${API_URL}/services?all=${includeInactive}`);
    if (res.ok) return await res.json();
  } catch (err) {
    // Backend offline
  }
  return includeInactive ? INITIAL_SERVICES : INITIAL_SERVICES.filter((s) => s.active);
}

/**
 * Unified Service Areas API
 */
export async function getServiceAreas(includeInactive = false): Promise<ServiceArea[]> {
  try {
    const res = await fetch(`${API_URL}/areas?all=${includeInactive}`);
    if (res.ok) return await res.json();
  } catch (err) {
    // Backend offline
  }
  const current = getLocalItem<ServiceArea[]>('dubai_transport_areas', INITIAL_AREAS);
  return includeInactive ? current : current.filter((a) => a.active);
}

export async function saveServiceArea(area: Partial<ServiceArea>): Promise<ServiceArea> {
  try {
    const res = await fetch(`${API_URL}/areas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(area),
    });
    if (res.ok) {
      const saved = await res.json();
      const current = getLocalItem<ServiceArea[]>('dubai_transport_areas', INITIAL_AREAS);
      setLocalItem('dubai_transport_areas', [...current, saved]);
      return saved;
    }
  } catch (err) {
    console.warn('Backend offline, saving area locally');
  }

  const newArea: ServiceArea = {
    id: area.id || 'area-' + Date.now(),
    name: area.name || 'New Dubai Area',
    district: area.district || 'Commercial & Downtown',
    popular: area.popular || false,
    active: area.active !== undefined ? area.active : true,
  };
  const current = getLocalItem<ServiceArea[]>('dubai_transport_areas', INITIAL_AREAS);
  setLocalItem('dubai_transport_areas', [...current, newArea]);
  return newArea;
}

export async function updateServiceArea(id: string, updates: Partial<ServiceArea>): Promise<ServiceArea> {
  try {
    const res = await fetch(`${API_URL}/areas/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      const current = getLocalItem<ServiceArea[]>('dubai_transport_areas', INITIAL_AREAS);
      setLocalItem('dubai_transport_areas', current.map((a) => (a.id === id ? updated : a)));
      return updated;
    }
  } catch (err) {
    console.warn('Backend offline, updating area locally');
  }

  const current = getLocalItem<ServiceArea[]>('dubai_transport_areas', INITIAL_AREAS);
  const found = current.find((a) => a.id === id);
  const updated: ServiceArea = found ? { ...found, ...updates } : ({ id, ...updates } as ServiceArea);
  setLocalItem('dubai_transport_areas', current.map((a) => (a.id === id ? updated : a)));
  return updated;
}

export async function deleteServiceArea(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/areas/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const current = getLocalItem<ServiceArea[]>('dubai_transport_areas', INITIAL_AREAS);
      setLocalItem('dubai_transport_areas', current.filter((a) => a.id !== id));
      return true;
    }
  } catch (err) {
    console.warn('Backend offline, deleting area locally');
  }

  const current = getLocalItem<ServiceArea[]>('dubai_transport_areas', INITIAL_AREAS);
  setLocalItem('dubai_transport_areas', current.filter((a) => a.id !== id));
  return true;
}

/**
 * Unified Quote Requests API
 */
export async function createQuoteRequest(quote: Omit<QuoteRequest, 'id' | 'reference_number' | 'created_at' | 'status'>): Promise<QuoteRequest> {
  return saveQuoteRequest(quote);
}

export async function saveQuoteRequest(quote: Omit<QuoteRequest, 'id' | 'reference_number' | 'created_at' | 'status'>): Promise<QuoteRequest> {
  try {
    const res = await fetch(`${API_URL}/quotes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(quote),
    });
    if (res.ok) {
      const created = await res.json();
      const current = getLocalItem<QuoteRequest[]>('dubai_transport_quotes', INITIAL_SAMPLE_QUOTES);
      setLocalItem('dubai_transport_quotes', [created, ...current]);
      return created;
    }
  } catch (err) {
    console.warn('Backend offline, saving quote locally');
  }

  // Local fallback
  const newQuote: QuoteRequest = {
    ...quote,
    id: 'req-' + Date.now(),
    reference_number: 'TR-' + Math.floor(10000 + Math.random() * 90000),
    status: 'New',
    created_at: new Date().toISOString(),
  };
  const current = getLocalItem<QuoteRequest[]>('dubai_transport_quotes', INITIAL_SAMPLE_QUOTES);
  setLocalItem('dubai_transport_quotes', [newQuote, ...current]);
  return newQuote;
}

export async function getQuoteRequests(): Promise<QuoteRequest[]> {
  try {
    const res = await fetch(`${API_URL}/quotes`);
    if (res.ok) {
      const data = await res.json();
      setLocalItem('dubai_transport_quotes', data);
      return data;
    }
  } catch (err) {
    // Backend offline
  }
  return getLocalItem<QuoteRequest[]>('dubai_transport_quotes', INITIAL_SAMPLE_QUOTES);
}

export async function updateQuoteRequest(id: string, updates: Partial<QuoteRequest>): Promise<QuoteRequest> {
  try {
    const res = await fetch(`${API_URL}/quotes/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      const updated = await res.json();
      const current = getLocalItem<QuoteRequest[]>('dubai_transport_quotes', INITIAL_SAMPLE_QUOTES);
      setLocalItem('dubai_transport_quotes', current.map((q) => (q.id === id ? updated : q)));
      return updated;
    }
  } catch (err) {
    console.warn('Server offline, updating quote locally');
  }

  const current = getLocalItem<QuoteRequest[]>('dubai_transport_quotes', INITIAL_SAMPLE_QUOTES);
  const found = current.find((q) => q.id === id);
  const updated: QuoteRequest = found ? { ...found, ...updates } : ({ id, ...updates } as QuoteRequest);
  setLocalItem('dubai_transport_quotes', current.map((q) => (q.id === id ? updated : q)));
  return updated;
}

export async function deleteQuoteRequest(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/quotes/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const current = getLocalItem<QuoteRequest[]>('dubai_transport_quotes', INITIAL_SAMPLE_QUOTES);
      setLocalItem('dubai_transport_quotes', current.filter((q) => q.id !== id));
      return true;
    }
  } catch (err) {
    console.warn('Server offline, deleting quote locally');
  }

  const current = getLocalItem<QuoteRequest[]>('dubai_transport_quotes', INITIAL_SAMPLE_QUOTES);
  setLocalItem('dubai_transport_quotes', current.filter((q) => q.id !== id));
  return true;
}

/**
 * Unified Contact Messages API
 */
export async function sendContactMessage(msg: { name: string; phone: string; email?: string; message: string }): Promise<ContactMessage> {
  try {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msg),
    });
    if (res.ok) {
      const saved = await res.json();
      const current = getLocalItem<ContactMessage[]>('dubai_transport_messages', INITIAL_MESSAGES);
      setLocalItem('dubai_transport_messages', [saved, ...current]);
      return saved;
    }
  } catch (err) {
    console.warn('Server offline, saving message locally');
  }

  const newMsg: ContactMessage = {
    id: 'msg-' + Date.now(),
    name: msg.name,
    phone: msg.phone,
    email: msg.email,
    message: msg.message,
    status: 'Unread',
    created_at: new Date().toISOString(),
  };
  const current = getLocalItem<ContactMessage[]>('dubai_transport_messages', INITIAL_MESSAGES);
  setLocalItem('dubai_transport_messages', [newMsg, ...current]);
  return newMsg;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const res = await fetch(`${API_URL}/messages`);
    if (res.ok) {
      const data = await res.json();
      setLocalItem('dubai_transport_messages', data);
      return data;
    }
  } catch (err) {
    // Backend offline
  }
  return getLocalItem<ContactMessage[]>('dubai_transport_messages', INITIAL_MESSAGES);
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_URL}/messages/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const current = getLocalItem<ContactMessage[]>('dubai_transport_messages', INITIAL_MESSAGES);
      setLocalItem('dubai_transport_messages', current.filter((m) => m.id !== id));
      return true;
    }
  } catch (err) {
    console.warn('Server offline, deleting message locally');
  }

  const current = getLocalItem<ContactMessage[]>('dubai_transport_messages', INITIAL_MESSAGES);
  setLocalItem('dubai_transport_messages', current.filter((m) => m.id !== id));
  return true;
}

export async function updateService(id: string, updates: Partial<TransportService>): Promise<TransportService> {
  try {
    const res = await fetch(`${API_URL}/services/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('Backend offline, updating service locally');
  }

  const found = INITIAL_SERVICES.find((s) => s.id === id);
  return found ? { ...found, ...updates } : ({ id, ...updates } as TransportService);
}

/**
 * Admin Stats API
 */
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const res = await fetch(`${API_URL}/admin/stats`);
    if (res.ok) return await res.json();
  } catch (err) {
    // Backend offline
  }

  const quotes = getLocalItem<QuoteRequest[]>('dubai_transport_quotes', INITIAL_SAMPLE_QUOTES);
  const vehicles = getLocalItem<Vehicle[]>('dubai_transport_vehicles', INITIAL_VEHICLES);
  const areas = INITIAL_AREAS;

  return {
    total_requests: quotes.length,
    new_requests: quotes.filter((q) => q.status === 'New').length,
    pending_quotes: quotes.filter((q) => q.status === 'Quotation Sent' || q.status === 'Contacted').length,
    confirmed_bookings: quotes.filter((q) => q.status === 'Confirmed' || q.status === 'Driver Assigned').length,
    completed_requests: quotes.filter((q) => q.status === 'Completed').length,
    total_vehicles: vehicles.length,
    active_vehicles: vehicles.filter((v) => v.active).length,
    total_areas: areas.length,
  };
}
