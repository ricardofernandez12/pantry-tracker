import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Parse the request body to extract pantry items
    const { pantryItems } = await req.json();

    // Ensure pantry items are provided
    if (!pantryItems || pantryItems.length === 0) {
      return NextResponse.json({ error: 'No pantry items provided' }, { status: 400 });
    }

    // Construct the prompt
    const prompt = `
    I have the following ingredients: ${pantryItems.join(', ')}.
    Please suggest a detailed recipe using these ingredients.
    Make sure the recipe is clear, with step-by-step instructions.
    `;

    // Fetch the completion from OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',  // Update model name as necessary
        prompt: prompt,
        max_tokens: 200,
        temperature: 0.7,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    // Check for errors in the response
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API error details:', errorData);
      throw new Error(`OpenRouter API returned an error: ${response.statusText}`);
    }

    const data = await response.json();
    const recipe = data.choices?.[0]?.text?.trim();

    // Ensure the recipe is valid
    if (!recipe) {
      throw new Error('Invalid recipe response from OpenRouter API');
    }

    // Return the generated recipe
    return NextResponse.json({ recipe }, { status: 200 });

  } catch (error) {
    console.error('Error fetching recipe:', error);
    return NextResponse.json({ error: 'Failed to fetch recipe' }, { status: 500 });
  }
}
