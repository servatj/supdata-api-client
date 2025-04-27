const SupadataClient = require('../index');
const supadataClientModule = require('../lib/supadataClient');

describe('Index module', () => {
  test('should export the SupadataClient class', () => {
    expect(SupadataClient).toBe(supadataClientModule);
  });
  
  test('should be able to instantiate an exported client', () => {
    const apiKey = 'test-api-key';
    const client = new SupadataClient(apiKey);
    
    expect(client).toBeInstanceOf(SupadataClient);
    expect(client.apiKey).toBe(apiKey);
  });
  
  test('should have all the required methods', () => {
    const client = new SupadataClient('test-key');
    
    // Check that core methods exist and are functions
    expect(typeof client.getTranscript).toBe('function');
    expect(typeof client.checkApiKey).toBe('function');
    expect(typeof client.getUrlContent).toBe('function');
    expect(typeof client.translateTranscript).toBe('function');
    expect(typeof client.mapWebsite).toBe('function');
    expect(typeof client.crawlWebsite).toBe('function');
    expect(typeof client.getCrawlResult).toBe('function');
    expect(typeof client.getVideo).toBe('function');
    expect(typeof client.getChannel).toBe('function');
    expect(typeof client.getPlaylist).toBe('function');
    expect(typeof client.getChannelVideos).toBe('function');
    expect(typeof client.getPlaylistVideos).toBe('function');
  });
}); 