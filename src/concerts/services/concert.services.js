import httpInstance from "../../shared/services/http.instance.js";
import {Concert} from "@/concerts/model/concert.entity.js";

/**
 * @class CategoryService
 * @description Service class for handling CRUD operations on concerts using HTTP requests
 */
export class ConcertService {
    /** @type {string} The API endpoint for concerts */
    resourceEndpoint = import.meta.env.VITE_CONCERTS_ENDPOINT_PATH;

    /**
     * Retrieves all concerts
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of categories
     */
    getAll() {
        return httpInstance.get(this.resourceEndpoint);
    }

    async getAllConcerts() {
        const { data } = await httpInstance.get(import.meta.env.VITE_CONCERTS_ENDPOINT_PATH);
        const concertList = Array.isArray(data) ? data : data.data || [];
        return concertList.map(concert => new Concert(concert));
    }




    /**
     * Retrieves a concerts by its ID
     * @param {number|string} id - The ID of the category to retrieve
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the category object
     */
    getById(id) {
        return httpInstance.get(this.resourceEndpoint).then(res => {
            const concert = res.data.find(c => c.id === id || c.id === parseInt(id));
            return { data: concert };
        });
    }


    /**
     * Creates a new concert
     * @param {Object} resource - The concert object to create
     * @param {string} resource.name - The name of the concert
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the created category
     */
    create(resource) {
        return httpInstance.post(this.resourceEndpoint, resource);
    }

    /**
     * Updates an existing category
     * @param {number|string} id - The ID of the category to update
     * @param {Object} resource - The updated category data
     * @param {string} resource.name - The updated name of the category
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to the updated category
     */
    update(id, resource) {
        return httpInstance.put(`${this.resourceEndpoint}/${id}`, resource);
    }

    /**
     * Deletes a category by its ID
     * @param {number|string} id - The ID of the category to delete
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves when the category is deleted
     */
    delete(id) {
        return httpInstance.delete(`${this.resourceEndpoint}/${id}`);
    }

    /**
     * Retrieves categories by name
     * @param {string} name - The name to search for
     * @returns {Promise<AxiosResponse<any>>} Promise that resolves to an array of matching categories
     */
    getByName(name) {
        return httpInstance.get(`${this.resourceEndpoint}?name=${name}`);
    }
}