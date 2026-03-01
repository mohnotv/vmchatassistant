// JSON analysis tools for YouTube channel data

export const JSON_TOOL_DECLARATIONS = [
  {
    name: 'compute_stats_json',
    description: 'Compute statistics (mean, median, std, min, max) for any numeric field in the JSON data. Use when user asks for statistics, averages, or distributions of numeric fields like view_count, like_count, comment_count, duration.',
    parameters: {
      type: 'object',
      properties: {
        field: {
          type: 'string',
          description: 'The numeric field name to compute statistics for (e.g., "view_count", "like_count", "comment_count", "duration")',
        },
      },
      required: ['field'],
    },
  },
  {
    name: 'plot_metric_vs_time',
    description: 'Create a time-series plot showing how a numeric metric changes over time. The plot displays as a React component in chat.',
    parameters: {
      type: 'object',
      properties: {
        metric_field: {
          type: 'string',
          description: 'The numeric field to plot over time (e.g., "view_count", "like_count", "comment_count")',
        },
      },
      required: ['metric_field'],
    },
  },
  {
    name: 'play_video',
    description: 'Play a YouTube video from the loaded channel data. User can specify by title, ordinal position (first, second, etc.), or special keywords like "most viewed".',
    parameters: {
      type: 'object',
      properties: {
        video_identifier: {
          type: 'string',
          description: 'How to identify the video: title (e.g., "asbestos video"), ordinal (e.g., "first", "second", "3"), or special (e.g., "most viewed", "most liked")',
        },
      },
      required: ['video_identifier'],
    },
  },
  {
    name: 'generateImage',
    description: 'Generate an image based on a text prompt and an optional anchor/reference image. The generated image is displayed in chat and can be downloaded.',
    parameters: {
      type: 'object',
      properties: {
        prompt: {
          type: 'string',
          description: 'Text description of the image to generate',
        },
        anchor_image: {
          type: 'string',
          description: 'Optional: base64 encoded anchor/reference image to guide generation',
        },
      },
      required: ['prompt'],
    },
  },
];

export const executeJsonTool = (toolName, args, jsonData) => {
  if (!jsonData || !Array.isArray(jsonData)) {
    return { error: 'No JSON data loaded. Please upload a JSON file first.' };
  }

  switch (toolName) {
    case 'compute_stats_json': {
      const { field } = args;
      const values = jsonData
        .map((item) => {
          const val = item[field];
          return typeof val === 'number' ? val : null;
        })
        .filter((v) => v !== null);

      if (values.length === 0) {
        return { error: `No numeric values found for field "${field}"` };
      }

      const sorted = [...values].sort((a, b) => a - b);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const median = sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)];
      const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
      const std = Math.sqrt(variance);

      return {
        field,
        count: values.length,
        mean: Math.round(mean * 100) / 100,
        median: Math.round(median * 100) / 100,
        std: Math.round(std * 100) / 100,
        min: sorted[0],
        max: sorted[sorted.length - 1],
      };
    }

    case 'plot_metric_vs_time': {
      const { metric_field } = args;
      const data = jsonData
        .map((item) => {
          const metric = item[metric_field];
          const date = item.releaseDate || item.release_date || item.date;
          if (typeof metric === 'number' && date) {
            return {
              date: new Date(date),
              value: metric,
              title: item.title || '',
            };
          }
          return null;
        })
        .filter((d) => d !== null)
        .sort((a, b) => a.date - b.date);

      if (data.length === 0) {
        return { error: `No valid data found for metric "${metric_field}" with dates` };
      }

      return {
        _chartType: 'metric_vs_time',
        metric_field,
        data,
      };
    }

    case 'play_video': {
      const { video_identifier } = args;
      const identifier = video_identifier.toLowerCase().trim();

      let video = null;

      // Check for ordinal positions
      const ordinalMap = {
        first: 0, second: 1, third: 2, fourth: 3, fifth: 4,
        '1st': 0, '2nd': 1, '3rd': 2, '4th': 3, '5th': 4,
      };
      if (ordinalMap.hasOwnProperty(identifier) || /^\d+$/.test(identifier)) {
        const index = ordinalMap.hasOwnProperty(identifier) ? ordinalMap[identifier] : parseInt(identifier) - 1;
        video = jsonData[index] || null;
      }
      // Check for "most viewed", "most liked", etc.
      else if (identifier.includes('most viewed') || identifier.includes('most views')) {
        video = jsonData.reduce((max, item) => 
          (item.view_count || item.viewCount || 0) > (max.view_count || max.viewCount || 0) ? item : max
        );
      } else if (identifier.includes('most liked') || identifier.includes('most likes')) {
        video = jsonData.reduce((max, item) => 
          (item.like_count || item.likeCount || 0) > (max.like_count || max.likeCount || 0) ? item : max
        );
      }
      // Search by title
      else {
        video = jsonData.find((item) => 
          (item.title || '').toLowerCase().includes(identifier)
        ) || null;
      }

      if (!video) {
        return { error: `Video not found: "${video_identifier}"` };
      }

      return {
        _type: 'video_card',
        title: video.title || 'Untitled',
        thumbnail: video.thumbnail || video.thumbnail_url || null,
        videoUrl: video.videoUrl || video.video_url || video.url || '',
        viewCount: video.view_count || video.viewCount || 0,
        likeCount: video.like_count || video.likeCount || 0,
        description: video.description || '',
      };
    }

    case 'generateImage': {
      const { prompt, anchor_image } = args;
      // For now, return a placeholder structure
      // In production, this would call an image generation API (Imagen, DALL-E, etc.)
      // Using Gemini's Imagen capability if available
      return {
        _type: 'generated_image',
        prompt,
        imageUrl: null, // Would be populated by actual API call
        anchorImage: anchor_image || null,
        // Placeholder: In real implementation, this would call the image generation API
        status: 'pending',
      };
    }

    default:
      return { error: `Unknown tool: ${toolName}` };
  }
};
