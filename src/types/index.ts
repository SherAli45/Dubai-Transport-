export interface Vehicle {
  id: string;
  vehicle_name: string;
  vehicle_type: 'all' | 'truck' | 'van' | 'pickup' | 'box_truck' | 'flatbed' | 'car' | 'refrigerated' | 'other';
  short_description: string;
  capacity: string;
  suitable_for: string;
  image_url: string;
  availability_status: 'available' | 'busy' | 'maintenance';
  dimensions?: string;
  payload_capacity?: string;
  active: boolean;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TransportService {
  id: string;
  title: string;
  short_description: string;
  long_description?: string;
  icon: string;
  image_url: string;
  active: boolean;
  display_order?: number;
}

export interface ServiceArea {
  id: string;
  name: string;
  district: string;
  popular: boolean;
  active: boolean;
}

export interface QuoteRequest {
  id: string;
  reference_number: string;
  customer_name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  service_id: string;
  vehicle_id?: string;
  pickup_area: string;
  dropoff_area: string;
  goods_type: string;
  load_size: 'Small' | 'Medium' | 'Large' | 'Not Sure';
  preferred_date: string;
  preferred_time: string;
  additional_notes?: string;
  status: 'New' | 'Contacted' | 'Quotation Sent' | 'Confirmed' | 'Driver Assigned' | 'Completed' | 'Cancelled';
  admin_notes?: string;
  quoted_amount?: number;
  created_at: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: 'Unread' | 'Responded' | 'Archived';
  created_at: string;
}

export interface AdminStats {
  total_requests: number;
  new_requests: number;
  pending_quotes: number;
  confirmed_bookings: number;
  completed_requests: number;
  total_vehicles: number;
  active_vehicles: number;
  total_areas: number;
}
