# Supadata API Wrapper

A Node.js wrapper for the Supadata API v1, designed for fetching web content and generating YouTube video transcripts.

## Features

- Simple API client for all Supadata endpoints
- Promise-based interface with proper error handling
- TypeScript-friendly JSDoc comments
- Examples for common use cases

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/supadata-api-wrapper.git

# Navigate to the directory
cd supadata-api-wrapper

# Install dependencies
npm install

# Copy and edit the environment variables
cp .env.example .env
# Edit the .env file with your API key
```

Or if you're using it as a package:

```bash
npm install supadata-api-wrapper
```

## Configuration

Create a `.env` file in the root directory with your Supadata API key:

```
SUPADATA_API_KEY=your_api_key_here
```

## Basic Usage

```javascript
const SupadataClient = require('supadata-api-wrapper');

// Initialize the client with your API key
const client = new SupadataClient('your_api_key_here');

// Or load from environment variables
// const client = new SupadataClient(process.env.SUPADATA_API_KEY);

// Example: Get a YouTube video transcript
async function getTranscript() {
  try {
    const transcript = await client.getTranscript('dQw4w9WgXcQ');
    console.log(transcript);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getTranscript();
```

## API Reference

### Initialization

```javascript
const client = new SupadataClient(apiKey, options);
```

Parameters:
- `apiKey` (string, required): Your Supadata API key
- `options` (object, optional):
  - `baseUrl` (string, optional): Custom API base URL (default: 'https://api.supadata.ai')

### Methods

#### YouTube Transcript

```javascript
// Get transcript for a YouTube video
const transcript = await client.getTranscript('videoId');

// Translate a YouTube video transcript
const translatedTranscript = await client.translateTranscript('videoId', 'targetLanguage');
```

#### Web Content

```javascript
// Get content from a URL
const content = await client.getUrlContent('https://example.com', options);

// Map a website structure
const siteMap = await client.mapWebsite('https://example.com', options);

// Start a website crawl
const crawlJob = await client.crawlWebsite('https://example.com', options);

// Get crawl results
const crawlResults = await client.getCrawlResult('jobId');
```

#### YouTube Data

```javascript
// Get YouTube video data
const video = await client.getVideo('videoId');

// Get YouTube channel data
const channel = await client.getChannel('channelId');

// Get YouTube playlist data
const playlist = await client.getPlaylist('playlistId');

// Get videos from a channel
const channelVideos = await client.getChannelVideos('channelId', options);

// Get videos from a playlist
const playlistVideos = await client.getPlaylistVideos('playlistId', options);
```

#### API Status

```javascript
// Check if your API key is valid
const status = await client.checkApiKey();
```

## Error Handling

The client includes enhanced error handling that provides meaningful error messages:

```javascript
try {
  const transcript = await client.getTranscript('invalid_video_id');
} catch (error) {
  console.error(error.message); // Formatted error message
  console.error(error.status);  // HTTP status code if available
  console.error(error.data);    // Error response data if available
}
```

## Examples

Check the `examples` directory for more usage examples:

```bash
# Run the basic usage example
node examples/basic-usage.js transcript dQw4w9Wg