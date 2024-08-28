// pages/api/getRecipe.js

import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export default async function handler(req, res) {
  const { pantryItems } = req.body;

  if (!pantryItems) {
    return res.status(400).json({ error: 'No pantry items provided' });
  }

  try {
    const prompt = `Suggest a recipe using the following ingredients: ${pantryItems.join(', ')}`;
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 150,
      temperature: 0.7,
    });

    const recipe = response.data.choices[0].text.trim();
    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
}
