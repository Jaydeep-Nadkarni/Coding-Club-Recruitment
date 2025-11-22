import express from 'express';
import { protect } from '../middleware/auth.js';
import Task from '../models/Task.js';
import { generateAIResponse } from '../utils/aiClient.js';

const router = express.Router();

// @desc    Generate AI Performance Report
// @route   POST /api/ai/generate-report
// @access  Private
router.post('/generate-report', protect, async (req, res) => {
  try {
    // 1. Fetch real-time user task stats
    const statsAggregation = await Task.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ['$status', 'in-progress'] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
    ]);

    const stats = statsAggregation[0] || {
      total: 0,
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    // 2. Prepare JSON object
    const userStats = JSON.stringify(stats, null, 2);

    // 3. Prepare the prompt
    const prompt = `You are an AI performance analyst.

Generate a detailed performance report for the user based on the statistics below.

Please structure your response using Markdown formatting:
- Use # for the main title.
- Use ## for section headers.
- Use **bold** for key numbers and emphasis.
- Use bullet points (-) for lists.

Include the following sections:
1. Overall Productivity Score (0–100)
2. Completed Tasks Analysis
3. Pending Tasks Analysis
4. Weekly/Monthly Performance Trend
5. Efficiency (time taken vs tasks completed)
6. Strengths
7. Weaknesses
8. Personal Recommendations
9. Productivity Tips
10. Motivation Message
11. Any patterns or insights observed

Write the report in a friendly, professional, motivational tone.

User Stats:
${userStats}`;

    // 4. Call AI API
    const report = await generateAIResponse(prompt);

    // 5. Return the report
    res.json({
      success: true,
      report,
      stats // Sending stats back might be useful for the UI too
    });

  } catch (error) {
    console.error('AI Report Generation Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate report',
    });
  }
});

export default router;
