const axios = require('axios');

class SupadataClient {
  /**
   * Initialize a new Supadata API client
   * @param {string} apiKey - Your Supadata API key
   * @param {Object} options - Additional options
   * @param {string} [options.baseUrl='https://api.supadata.ai'] - Base URL for the API
   */
  constructor(apiKey, options = {}) {
    if (!apiKey) {
      throw new Error('API key is required');
    }
    
    this.apiKey = apiKey;
    this.baseUrl = options.baseUrl || 'https://api.supadata.ai';
    
    // Initialize axios instance with default configurations
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'X-API-Key': this.apiKey,
        'Content-Type': 'application/json'
      }
    });
    
    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => this.handleApiError(error)
    );
  }

  /**
   * Handle API errors with better messages
   * @private
   */
  handleApiError(error) {
    if (error.response) {
      // Server responded with a status code outside of 2xx range
      const status = error.response.status;
      const data = error.response.data;
      
      let message = `Supadata API Error (${status}): `;
      
      if (status === 401) {
        message += 'Invalid or missing API key';
      } else if (status === 429) {
        message += 'Rate limit exceeded';
      } else if (data && data.message) {
        message += data.message;
      } else {
        message += 'Unknown error occurred';
      }
      
      const enhancedError = new Error(message);
      enhancedError.status = status;
      enhancedError.data = data;
      
      return Promise.reject(enhancedError);
    }
    
    if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('No response received from Supadata API'));
    }
    
    // Something else caused the error
    return Promise.reject(error);
  }

  /**
   * Get a YouTube video transcript
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<Object>} - The transcript data
   */
  async getTranscript(videoId) {
    if (!videoId) {
      throw new Error('Video ID is required');
    }
    
    const response = await this.client.get(`/v1/youtube/transcript?videoId=${encodeURIComponent(videoId)}`);
    return response.data;
  }

  /**
   * Check API key validity
   * @returns {Promise<Object>} - API health status
   */
  async checkApiKey() {
    const response = await this.client.get('/v1/health');
    return response.data;
  }

  /**
   * Get content from a URL
   * @param {string} url - URL to scrape
   * @param {Object} [options] - Additional options
   * @returns {Promise<Object>} - Scraped content
   */
  async getUrlContent(url, options = {}) {
    if (!url) {
      throw new Error('URL is required');
    }
    
    const params = {
      url: url,
      ...options
    };
    
    const response = await this.client.get('/v1/web/scrape', { params });
    return response.data;
  }

  /**
   * Translate a YouTube video transcript
   * @param {string} videoId - YouTube video ID
   * @param {string} targetLanguage - Target language code
   * @returns {Promise<Object>} - Translated transcript
   */
  async translateTranscript(videoId, targetLanguage) {
    if (!videoId) {
      throw new Error('Video ID is required');
    }
    
    if (!targetLanguage) {
      throw new Error('Target language is required');
    }
    
    const params = {
      videoId,
      targetLanguage
    };
    
    const response = await this.client.get('/v1/youtube/transcript/translate', { params });
    return response.data;
  }

  /**
   * Map a website structure
   * @param {string} url - URL of the website to map
   * @param {Object} [options] - Additional options
   * @returns {Promise<Object>} - Website map
   */
  async mapWebsite(url, options = {}) {
    if (!url) {
      throw new Error('URL is required');
    }
    
    const params = {
      url,
      ...options
    };
    
    const response = await this.client.get('/v1/web/map', { params });
    return response.data;
  }

  /**
   * Start a website crawl
   * @param {string} url - Starting URL for the crawl
   * @param {Object} [options] - Crawl options
   * @returns {Promise<Object>} - Crawl job data
   */
  async crawlWebsite(url, options = {}) {
    if (!url) {
      throw new Error('URL is required');
    }
    
    const payload = {
      url,
      ...options
    };
    
    const response = await this.client.post('/v1/web/crawl', payload);
    return response.data;
  }

  /**
   * Get the result of a crawl job
   * @param {string} jobId - ID of the crawl job
   * @returns {Promise<Object>} - Crawl results
   */
  async getCrawlResult(jobId) {
    if (!jobId) {
      throw new Error('Job ID is required');
    }
    
    const response = await this.client.get(`/v1/web/crawl/${encodeURIComponent(jobId)}`);
    return response.data;
  }

  /**
   * Get YouTube video data
   * @param {string} videoId - YouTube video ID
   * @returns {Promise<Object>} - Video data
   */
  async getVideo(videoId) {
    if (!videoId) {
      throw new Error('Video ID is required');
    }
    
    const response = await this.client.get(`/v1/youtube/video?videoId=${encodeURIComponent(videoId)}`);
    return response.data;
  }

  /**
   * Get YouTube channel data
   * @param {string} channelId - YouTube channel ID
   * @returns {Promise<Object>} - Channel data
   */
  async getChannel(channelId) {
    if (!channelId) {
      throw new Error('Channel ID is required');
    }
    
    const response = await this.client.get(`/v1/youtube/channel?channelId=${encodeURIComponent(channelId)}`);
    return response.data;
  }

  /**
   * Get YouTube playlist data
   * @param {string} playlistId - YouTube playlist ID
   * @returns {Promise<Object>} - Playlist data
   */
  async getPlaylist(playlistId) {
    if (!playlistId) {
      throw new Error('Playlist ID is required');
    }
    
    const response = await this.client.get(`/v1/youtube/playlist?playlistId=${encodeURIComponent(playlistId)}`);
    return response.data;
  }

  /**
   * Get videos from a YouTube channel
   * @param {string} channelId - YouTube channel ID
   * @param {Object} [options] - Additional options
   * @returns {Promise<Object>} - Channel videos
   */
  async getChannelVideos(channelId, options = {}) {
    if (!channelId) {
      throw new Error('Channel ID is required');
    }
    
    const params = {
      channelId,
      ...options
    };
    
    const response = await this.client.get('/v1/youtube/channel/videos', { params });
    return response.data;
  }

  /**
   * Get videos from a YouTube playlist
   * @param {string} playlistId - YouTube playlist ID
   * @param {Object} [options] - Additional options
   * @returns {Promise<Object>} - Playlist videos
   */
  async getPlaylistVideos(playlistId, options = {}) {
    if (!playlistId) {
      throw new Error('Playlist ID is required');
    }
    
    const params = {
      playlistId,
      ...options
    };
    
    const response = await this.client.get('/v1/youtube/playlist/videos', { params });
    return response.data;
  }
}

module.exports = SupadataClient;