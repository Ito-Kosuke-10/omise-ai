import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface BusinessPlanInput {
  type: string;
  seats: number;
  atv: number;
  hours: string;
  area: string;
}

export interface MenuExample {
  name: string;
  price: number;
  description: string;
}

export interface BusinessPlanOutput extends BusinessPlanInput {
  id: number;
  turnover: number;
  daily_guests: number;
  monthly_sales: number;
  cogs_rate: number;
  cogs: number;
  gross_profit: number;
  labor_cost: number;
  fixed_cost: number;
  op_income: number;
  payback_months: number;
  concept: string;
  action: string;
  // 拡張フィールド
  catch_copy?: string;
  target_audience?: string;
  menu_examples?: MenuExample[];
  sns_strategy?: string;
  staff_count?: number;
  peak_operation?: string;
  initial_investment?: number;
  opening_cost?: number;
  funding_methods?: string[];
  seat_occupancy_rate?: number;
  created_at: string;
}

export const api = {
  async createPlan(data: BusinessPlanInput): Promise<BusinessPlanOutput> {
    const response = await axios.post(`${API_URL}/api/plans`, data);
    return response.data;
  },

  async getPlan(id: number): Promise<BusinessPlanOutput> {
    const response = await axios.get(`${API_URL}/api/plans/${id}`);
    return response.data;
  },

  async getPlans(): Promise<BusinessPlanOutput[]> {
    const response = await axios.get(`${API_URL}/api/plans`);
    return response.data;
  },

  async getMenus(type: string, concept: string) {
    const response = await axios.get(`${API_URL}/api/menus/${type}/${concept}`);
    return response.data.suggestions;
  },

  async getSubsidies(area: string) {
    const response = await axios.get(`${API_URL}/api/subsidies/${area}`);
    return response.data.subsidies;
  }
};


