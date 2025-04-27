const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const SupadataClient = require('../index');

describe('SupadataClient', () => {
  // Mock of the axios instance
  let mock;
  let client;
  const API_KEY = 'test-api-key';
  
  beforeEach(() => {
    // Create a fresh client and mock before each test
    client = new SupadataClient(API_KEY);
    mock = new MockAdapter(client.client);
  });
  
  afterEach(() => {
    mock.reset();
  });
  
  describe('constructor', () => {
    test('should throw an error if no API key is provided', () => {
      expect(() => new SupadataClient()).toThrow('API key is required');
    });
    
    test('should use default base URL if not provided', () => {
      const client = new SupadataClient(API_KEY);
      expect(client.baseUrl).toBe('https://api.supadata.ai');
    });
    
    test('should use custom base URL if provided', () => {
      const customUrl = 'https://custom.api.example.com';
      const client = new SupadataClient(API_KEY, { baseUrl: customUrl });
      expect(client.baseUrl).toBe(customUrl);
    });
    
    test('should set up axios instance with correct headers', () => {
      const client = new SupadataClient(API_KEY);
      expect(client.client.defaults.headers['X-API-Key']).toBe(API_KEY);
      expect(client.client.defaults.headers['Content-Type']).toBe('application/json');
    });
  });
  
  describe('getTranscript', () => {
    test('should throw an error if no videoId is provided', async () => {
      await expect(client.getTranscript()).rejects.toThrow('Video ID is required');
    });
    
    test('should call the correct API endpoint', async () => {
      const videoId = 'test-video-id';
      const mockResponse = { transcript: 'This is a test transcript' };
      
      mock.onGet(`/v1/youtube/transcript?videoId=${videoId}`).reply(200, mockResponse);
      
      const result = await client.getTranscript(videoId);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('checkApiKey', () => {
    test('should call the correct API endpoint', async () => {
      const mockResponse = { valid: true };
      
      mock.onGet('/v1/health').reply(200, mockResponse);
      
      const result = await client.checkApiKey();
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('getUrlContent', () => {
    test('should throw an error if no url is provided', async () => {
      await expect(client.getUrlContent()).rejects.toThrow('URL is required');
    });
    
    test('should call the correct API endpoint with parameters', async () => {
      const url = 'https://example.com';
      const options = { depth: 2 };
      const mockResponse = { content: 'Test content' };
      
      mock.onGet('/v1/web/scrape').reply(config => {
        expect(config.params.url).toBe(url);
        expect(config.params.depth).toBe(2);
        return [200, mockResponse];
      });
      
      const result = await client.getUrlContent(url, options);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('translateTranscript', () => {
    test('should throw an error if no videoId is provided', async () => {
      await expect(client.translateTranscript(null, 'es')).rejects.toThrow('Video ID is required');
    });
    
    test('should throw an error if no targetLanguage is provided', async () => {
      await expect(client.translateTranscript('video-id')).rejects.toThrow('Target language is required');
    });
    
    test('should call the correct API endpoint with parameters', async () => {
      const videoId = 'test-video-id';
      const targetLanguage = 'es';
      const mockResponse = { transcript: 'Este es un video de prueba' };
      
      mock.onGet('/v1/youtube/transcript/translate').reply(config => {
        expect(config.params.videoId).toBe(videoId);
        expect(config.params.targetLanguage).toBe(targetLanguage);
        return [200, mockResponse];
      });
      
      const result = await client.translateTranscript(videoId, targetLanguage);
      expect(result).toEqual(mockResponse);
    });
  });
  
  describe('error handling', () => {
    test('should handle 401 errors gracefully', async () => {
      mock.onGet('/v1/health').reply(401);
      
      await expect(client.checkApiKey()).rejects.toThrow('Supadata API Error (401): Invalid or missing API key');
    });
    
    test('should handle 429 errors gracefully', async () => {
      mock.onGet('/v1/health').reply(429);
      
      await expect(client.checkApiKey()).rejects.toThrow('Supadata API Error (429): Rate limit exceeded');
    });
    
    test('should handle error messages from the API', async () => {
      mock.onGet('/v1/health').reply(400, { message: 'Bad request' });
      
      await expect(client.checkApiKey()).rejects.toThrow('Supadata API Error (400): Bad request');
    });
    
    test('should handle network errors', async () => {
      mock.onGet('/v1/health').networkError();
      
      await expect(client.checkApiKey()).rejects.toThrow('Network Error');
    });
  });
}); 