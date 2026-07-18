import { GoogleGenAI } from '@google/genai';
import { db } from './dbStore.js';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (key && key !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    } else {
      console.warn('[AI] GEMINI_API_KEY is not configured or using placeholder. Running in mock responder mode.');
    }
  }
  return aiClient;
}

export async function askTournamentCopilot(userInput: string, chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[] = []): Promise<string> {
  const client = getAiClient();
  
  // Format teams, matches, stadiums for contextual grounding inside systemInstruction
  const teams = db.getTeams().map(t => `${t.name} (${t.code}) - Group: ${t.group}, Rank: ${t.rank}, Coach: ${t.coach}, Points: ${t.points}`).join('\n');
  const stadiums = db.getStadiums().map(s => `${s.name} in ${s.city}, ${s.country} - Capacity: ${s.capacity}, Current Weather: ${s.weather} (${s.temperature})`).join('\n');
  const matches = db.getMatches().map(m => {
    const homeTeam = db.getTeams().find(t => t.id === m.homeTeamId)?.name || 'Unknown';
    const awayTeam = db.getTeams().find(t => t.id === m.awayTeamId)?.name || 'Unknown';
    return `${homeTeam} vs ${awayTeam} - Status: ${m.status}, Score: ${m.homeScore}-${m.awayScore}, Date: ${m.date}, Time: ${m.time}, Round: ${m.round}`;
  }).join('\n');
  const topPlayers = db.getPlayers().map(p => `${p.name} (No. ${p.number}, ${p.position} for team ${p.teamId}) - Rating: ${p.rating}, Goals: ${p.goals}, Assists: ${p.assists}`).join('\n');

  const systemInstruction = `You are the Official AI Tournament Copilot and virtual guide for the World Football Championship 2026.
You are expert, friendly, professional, and possess complete tournament database knowledge.

Here is the LIVE tournament status and details for grounding your responses:

[TEAMS IN PLAY]
${teams}

[HOST STADIUMS & DETAILS]
${stadiums}

[RECENT, LIVE, AND SCHEDULED MATCHES]
${matches}

[FEATURED TOURNAMENT PLAYERS]
${topPlayers}

[RULES & CONTEXT]
- Speak with athletic elegance, passion, and objectivity.
- Avoid repeating raw system codes or database IDs (like 't1' or 's2'); instead use their human-readable names (like 'United States' or 'SoFi Stadium').
- You can answer questions about match schedules, group standings, host city guides, team statistics, tactics, stadium capacity, hotel suggestions, weather updates, and ticketing rules.
- If asked about predictions, provide highly engaging, detailed tactical analyses of both teams, considering key players and recent scores, but keep a professional, balanced perspective.
- You can speak and reply in English, French, Spanish, German, Portuguese, Arabic, Chinese, Japanese, Korean, and Khmer depending on how the user greets or queries you.
- Ensure your markdown output is incredibly clean, structured, and easy to read.`;

  if (!client) {
    // Elegant fallback simulation when no API key is provided, so the app still functions perfectly for previews!
    return getMockCopilotResponse(userInput);
  }

  try {
    // We use chats.create for full conversational context if history is provided
    const chat = client.chats.create({
      model: 'gemini-3.5-flash',
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: chatHistory.length > 0 ? chatHistory : undefined
    });

    const response = await chat.sendMessage({ message: userInput });
    return response.text || 'I apologize, but I could not synthesize a response. Let us try again!';
  } catch (err) {
    console.error('[AI] Gemini Generation Error:', err);
    return `### ⚽ Copilot Connection Alert
I am currently operating in high-performance local simulation mode. Here is what you need to know about your query:

${getMockCopilotResponse(userInput)}`;
  }
}

function getMockCopilotResponse(input: string): string {
  const norm = input.toLowerCase();
  
  if (norm.includes('predict') || norm.includes('win') || norm.includes('champion')) {
    return `### 🏆 Tournament Championship Prediction Analysis

Based on current tournament standings and player forms, here is our tactical analytical forecast:

1. **Argentina 🇦🇷**: With **Lionel Messi** orchestrating the offense (currently holding 4 goals and 3 assists) and Lionel Scaloni's disciplined setup, Argentina remains the powerhouse favorite. Their possession dominance sits at a command-level 68%.
2. **United States 🇺🇸**: Propelled by home crowd energy, clinical link-play between **Christian Pulisic** and Weston McKennie, and dynamic speed, they are a high-pressing threat to anyone.
3. **Brazil 🇧🇷**: Yet to concede a single goal in the tournament! **Vinícius Júnior** is at the absolute peak of his direct dribbling powers.

**Tactical Forecast**: A potential Brazil vs. Argentina semi-final would be an unmissable tactical battle of unmatched flair vs. surgical passing structure!`;
  }

  if (norm.includes('stadium') || norm.includes('city') || norm.includes('where') || norm.includes('hotel')) {
    return `### 🏟️ 2026 Host Venues & Travel Guide

The tournament is hosted across premium locations. Here is the active venue registry:

*   **MetLife Stadium (NY/NJ)**: Capacity 82,500. Weather: 24°C, Clear Skies. *Recommended Stay*: Hilton Meadowlands or Sheraton Plaza.
*   **SoFi Stadium (Los Angeles)**: Capacity 70,240. Weather: 27°C, Sunny. *Recommended Stay*: The Westin LAX or Sofi Plaza Inn.
*   **Estadio Azteca (Mexico City)**: Capacity 87,523. Weather: 21°C, Partly Cloudy.
*   **BC Place (Vancouver)**: Capacity 54,500. Weather: 16°C, Light Rain.
*   **Olympic Stadium (Phnom Penh)**: Capacity 50,000. Tropical Humid 31°C.

*Tip*: Free electric fan shuttle loops run continuously from city centers to all stadiums starting 4 hours before kickoff!`;
  }

  if (norm.includes('cambodia') || norm.includes('khmer') || norm.includes('vathanaka')) {
    return `### 🇰🇭 The Angkor Warriors: Cambodia's Historic Run!

Cambodia is competing with unmatched passion! Under the guidance of coach **Koji Gyotoku**, they have won 1 and lost 1, boasting a total of 3 points.

*   **Key Star**: **Chan Vathanaka** (No. 11, Forward). Age 32. He scored a majestic solo breakaway goal at the historic Estadio Azteca in front of 87,000 fans!
*   **Rising Talent**: **Lim Pisoth** (No. 7, Forward), who scored a gorgeous curler past Argentina's defense.
*   **Next Fixture**: Special Group D showdown against **China (CHN)** at the Olympic Stadium in Phnom Penh on **July 19, 18:00**.

*Sabaidee!* The Angkor Warriors are demonstrating incredible speed, determination, and tactical discipline!`;
  }

  if (norm.includes('ticket') || norm.includes('book') || norm.includes('price') || norm.includes('seat')) {
    return `### 🎫 Ticketing and Seat Selection FAQ

Tournament tickets are organized into four intuitive categories to accommodate all football supporters:

1.  **VIP Club**: $450 (includes premium hospitality lounges, soft-padded central seating, and stadium culinary access).
2.  **Category 1**: $250 (lower-bowl sideline locations with superb proximity to pitch action).
3.  **Category 2**: $150 (mid-tier corner/behind-the-goal seating offering balanced visual angles).
4.  **Category 3**: $85 (upper-bowl seats with an immersive, stadium-wide bird’s-eye perspective).

*Booking Instructions*: Use our live **Ticketing Simulator** tab, pick your match, click on the interactive seating chart, select a category, and generate your customized digital Boarding Pass with a simulated QR ticket code!`;
  }

  return `### ⚽ Welcome to the 2026 Tournament Intelligence Center!
  
I am your **AI Tournament Copilot**, fully grounded in our tournament database. You can ask me questions about:
*   **Tactical Predictions**: "Predict the match between France and Japan"
*   **Schedules & Standings**: "Who is currently leading Group A?"
*   **Player Profiles**: "Show statistics for Christian Pulisic or Chan Vathanaka"
*   **Stadium Travel & Lodging**: "Recommend hotels near SoFi Stadium"
*   **Cambodian Squad**: "Tell me about the Angkor Warriors' historic run"

How can I assist your tournament journey today? 🏟️`;
}

function generateMockPrediction(homeTeam: any, awayTeam: any, homeRating: string, awayRating: string): string {
  const homeScoreDiff = (homeTeam.points || 0) - (awayTeam.points || 0);
  const ratingDiff = parseFloat(homeRating) - parseFloat(awayRating);
  
  if (homeScoreDiff > 2 || ratingDiff > 1.5) {
    return `With an impressive squad average rating of ${homeRating} and dominant group stage form, ${homeTeam.name} are heavily favored to control the tempo and secure a vital victory against a resilient ${awayTeam.name} side.`;
  } else if (homeScoreDiff < -2 || ratingDiff < -1.5) {
    return `Despite ${homeTeam.name}'s home support, ${awayTeam.name}'s superior clinical depth (squad rating ${awayRating}) is forecasted to break through the defense and secure a hard-fought away win.`;
  } else {
    return `A highly compact tactical battle is anticipated between ${homeTeam.name} and ${awayTeam.name}, with both sides matching each other in rating and midfield intensity, likely resulting in a hard-fought draw.`;
  }
}

export async function getMatchPrediction(matchId: string): Promise<string> {
  const client = getAiClient();
  
  const match = db.getMatches().find(m => m.id === matchId);
  if (!match) {
    return "Match not found.";
  }
  
  const homeTeam = db.getTeams().find(t => t.id === match.homeTeamId);
  const awayTeam = db.getTeams().find(t => t.id === match.awayTeamId);
  if (!homeTeam || !awayTeam) {
    return "Teams not found for prediction context.";
  }
  
  const homePlayers = db.getPlayers().filter(p => p.teamId === match.homeTeamId);
  const awayPlayers = db.getPlayers().filter(p => p.teamId === match.awayTeamId);
  
  const homeAvgRating = homePlayers.length > 0 
    ? (homePlayers.reduce((sum, p) => sum + p.rating, 0) / homePlayers.length).toFixed(1)
    : "82.5";
  const awayAvgRating = awayPlayers.length > 0 
    ? (awayPlayers.reduce((sum, p) => sum + p.rating, 0) / awayPlayers.length).toFixed(1)
    : "81.0";
    
  const homeTopPlayers = homePlayers.sort((a, b) => b.rating - a.rating).slice(0, 2).map(p => `${p.name} (Rating: ${p.rating})`).join(', ');
  const awayTopPlayers = awayPlayers.sort((a, b) => b.rating - a.rating).slice(0, 2).map(p => `${p.name} (Rating: ${p.rating})`).join(', ');
  
  const homeStandingText = `Group Stage Record - Points: ${homeTeam.points || 0}, Played: ${homeTeam.played || 0}, GD: ${(homeTeam.goalsFor || 0) - (homeTeam.goalsAgainst || 0)}`;
  const awayStandingText = `Group Stage Record - Points: ${awayTeam.points || 0}, Played: ${awayTeam.played || 0}, GD: ${(awayTeam.goalsFor || 0) - (awayTeam.goalsAgainst || 0)}`;
  
  const prompt = `Generate a single-sentence outcome forecast for the match between ${homeTeam.name} (${homeTeam.code}) and ${awayTeam.name} (${awayTeam.code}).
  
Context details:
- ${homeTeam.name}: ${homeStandingText}. Average Player Rating: ${homeAvgRating}. Key Players: ${homeTopPlayers}.
- ${awayTeam.name}: ${awayStandingText}. Average Player Rating: ${awayAvgRating}. Key Players: ${awayTopPlayers}.

Your response MUST be exactly one sentence. Speak with athletic authority and excitement, referencing the key statistics, standing points, or team ratings provided. Keep it highly objective, premium, and concise. Do not use markdown headers, bold headers, or bullet points.`;

  if (!client) {
    return generateMockPrediction(homeTeam, awayTeam, homeAvgRating, awayAvgRating);
  }
  
  try {
    const response = await client.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });
    const predictionText = response.text?.trim();
    if (predictionText) {
      // Clean up any double quotes or backticks that the model might wrap it in
      return predictionText.replace(/^["'`]|["'`]$/g, '').trim();
    }
    return generateMockPrediction(homeTeam, awayTeam, homeAvgRating, awayAvgRating);
  } catch (err) {
    console.error('[AI] Prediction generation error:', err);
    return generateMockPrediction(homeTeam, awayTeam, homeAvgRating, awayAvgRating);
  }
}

