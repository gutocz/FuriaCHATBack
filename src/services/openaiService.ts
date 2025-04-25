import OpenAI from "openai";

const baseURL = process.env.BASE_AI_URL;

const apiKey = process.env.OPENAI_API_KEY

const api = new OpenAI({ apiKey, baseURL });

export async function translateMessage(message: string): Promise<string> {
  const prompt = `
    Sua função é identificar a intenção dessa mensagem: "${message}" de um fã da FURIA e convertê-la em um dos seguintes comandos:
    /proximojogo — para saber o próximo jogo
    /proximosjogos — para saber os últimos jogos
    /elenco — para saber os jogadores do time
    /ranking — para saber a posição no ranking
    /coach — para frases do técnico Guerri
    /desconhecido — caso não seja possível classificar

    Retorne APENAS o comando correspondente. Nada mais.
    `;

  const response = await api.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0,
    max_tokens: 20,
  });

  const command = response.choices[0]?.message?.content?.trim();
  return command || "/desconhecido";
}
