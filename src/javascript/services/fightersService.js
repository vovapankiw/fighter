import { callApi } from '../helpers/apiHelper';

class FighterService {
  async getFighters() {
    try {
      const endpoint = 'fighters.json';
      const apiResult = await callApi(endpoint, 'GET');

      return apiResult;
    } catch (error) {
      throw error;
    }
  }

  async getFighterDetails(id) {
    // endpoint - `details/fighter/${id}.json`;
    try {
      const fighterDetailsEndpoint = `details/fighter/${id}.json`;
      const apiResult = await callApi(fighterDetailsEndpoint, 'GET');

      return apiResult;
    } catch (error) {
      throw error;
    }
  }
}

export const fighterService = new FighterService();
