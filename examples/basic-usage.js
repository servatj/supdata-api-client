// Import environment variables from .env file
require('dotenv').config();

// Import the Supadata client
const SupadataClient = require('../index');

// Initialize the client with your API key
const client = new SupadataClient(process.env.SUPADATA_API_KEY);

// Example function to get a YouTube transcript
async function getYouTubeTranscript(videoId) {
  try {
    console.log(`Getting transcript for video: ${videoId}`);
    const transcript = await client.getTranscript(videoId);
    console.log('Transcript retrieved successfully:');
    console.log(transcript);
    return transcript;
  } catch (error) {
    console.error('Error getting transcript:', error.message);
    return null;
  }
}

// Example function to check API key
async function checkApiStatus() {
  try {
    console.log('Checking API key validity...');
    const status = await client.checkApiKey();
    console.log('API status:', status);
    return status;
  } catch (error) {
    console.error('Error checking API key:', error.message);
    return null;
  }
}

// Example function to get website content
async function getWebsiteContent(url) {
  try {
    console.log(`Getting content from URL: ${url}`);
    const content = await client.getUrlContent(url);
    console.log('Content retrieved successfully:');
    console.log(content);
    return content;
  } catch (error) {
    console.error('Error getting URL content:', error.message);
    return null;
  }
}

// Example function to translate a transcript
async function translateYouTubeTranscript(videoId, targetLanguage) {
  try {
    console.log(`Translating transcript for video ${videoId} to ${targetLanguage}`);
    const translatedTranscript = await client.translateTranscript(videoId, targetLanguage);
    console.log('Transcript translated successfully:');
    console.log(translatedTranscript);
    return translatedTranscript;
  } catch (error) {
    console.error('Error translating transcript:', error.message);
    return null;
  }
}

// Example function to crawl a website
async function startWebsiteCrawl(url) {
  try {
    console.log(`Starting crawl for website: ${url}`);
    const crawlJob = await client.crawlWebsite(url, {
      maxPages: 10,
      depth: 2
    });
    console.log('Crawl job started successfully:', crawlJob);
    
    // Wait a bit and get results
    console.log('Waiting for crawl to complete...');
    
    // In a real application, you might implement polling or webhooks here
    // For demo purposes, let's just wait a few seconds
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    if (crawlJob.jobId) {
      console.log(`Getting crawl results for job: ${crawlJob.jobId}`);
      const results = await client.getCrawlResult(crawlJob.jobId);
      console.log('Crawl results:', results);
      return results;
    }
    
    return crawlJob;
  } catch (error) {
    console.error('Error during website crawl:', error.message);
    return null;
  }
}

// Usage example
async function runExamples() {
  // Set these values to test the examples
  const videoId = 'dQw4w9WgXcQ'; // Replace with an actual YouTube video ID
  const websiteUrl = 'https://example.com'; // Replace with an actual website URL
  const targetLanguage = 'es'; // Replace with an actual language code
  
  // Check if API key is valid
  await checkApiStatus();
  
  // Run examples based on arguments
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'transcript':
      await getYouTubeTranscript(args[1] || videoId);
      break;
    case 'website':
      await getWebsiteContent(args[1] || websiteUrl);
      break;
    case 'translate':
      await translateYouTubeTranscript(args[1] || videoId, args[2] || targetLanguage);
      break;
    case 'crawl':
      await startWebsiteCrawl(args[1] || websiteUrl);
      break;
    default:
      console.log('Available commands: transcript, website, translate, crawl');
      console.log('Example usage: node basic-usage.js transcript dQw4w9WgXcQ');
  }
}

// Run the examples
runExamples().catch(error => {
  console.error('Error in examples:', error);
});
