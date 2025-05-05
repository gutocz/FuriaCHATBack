import OpenAI from "openai";

const baseURL = process.env.BASE_AI_URL;

const apiKey = process.env.OPENAI_API_KEY;

const api = new OpenAI({ apiKey, baseURL });

export async function translateMessage(message: string): Promise<string> {
  const prompt = `
  Você é uma IA que ajuda fãs da FURIA a receber informações sobre o time. Sua missão é interpretar a intenção da mensagem de um fã e transformá-la em um dos comandos disponíveis. Responda **apenas com o comando correspondente** (ex: "/elenco"), sem explicações.

  Comandos disponíveis:
  - /cumprimento - qualquer cumprimento ou saudação
  - /proximojogo — informações sobre o próximo jogo
  - /proximosjogos — próximos jogos do time
  - /ultimosjogos — últimos jogos realizados
  - /elenco — jogadores ativos do time
  - /jogadoresinativos — jogadores atualmente inativos
  - /exjogadores — jogadores que já passaram pela FURIA
  - /ranking — posição atual no ranking
  - /coach — nome do técnico principal
  - /coachalternativos — todos os técnicos registrados
  - /lider — quem é o in-game leader
  - /fundadores — quem fundou a organização
  - /ceo — quem são os CEOs
  - /criada — data de criação da FURIA
  - /ganhos — quanto a FURIA já ganhou em premiações
  - /jogos — quais jogos a organização participa
  - /ondefica — país ou região onde a FURIA está sediada
  - /desconhecido — se a mensagem não corresponder a nada acima

  Mensagem do fã: "${message}"

  Responda com o comando apropriado apenas.
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
    max_tokens: 100, // Testar com mais tokens
  });

  const command = response.choices[0]?.message?.content?.trim();
  return command || "/desconhecido";
}
