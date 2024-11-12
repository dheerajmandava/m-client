import axiosClient from '../axiosClient';
import ShopsApi from './shops';
import JobsApi from './jobs';
import MechanicsApi from './mechanics';
import ScheduleApi from './schedule';
import InventoryApi from './inventory';
import SuppliersApi from './suppliers';
import EstimatesApi from './estimates';
import PartOrdersApi from './partOrders';

class Api {
  constructor() {
    // Initialize all API modules
    this.shops = new ShopsApi(axiosClient);
    this.jobs = new JobsApi(axiosClient);
    this.mechanics = new MechanicsApi(axiosClient);
    this.schedule = new ScheduleApi(axiosClient);
    this.inventory = new InventoryApi(axiosClient);
    this.suppliers = new SuppliersApi(axiosClient);
    this.estimates = new EstimatesApi(axiosClient);
    this.partOrders = new PartOrdersApi(axiosClient);
  }
}

// Create and export a singleton instance
export const api = new Api();

// Export individual classes for testing or extension
export {
  ShopsApi,
  JobsApi,
  MechanicsApi,
  ScheduleApi,
  InventoryApi,
  SuppliersApi,
  EstimatesApi,
  PartOrdersApi
}; 