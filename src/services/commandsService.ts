import { scrapeFuria } from "../utils/scrape";

import furiaData from '../utils/furia_data.json';

const commands: Record<string, Promise<string>> = {
  "/cumprimento": cumprimento(),
  "/proximojogo": proximojogo(),
  "/proximosjogos": proximosjogos(),
  "/ultimosjogos": ultimosjogos(),
  "/elenco": elenco(),
  "/ranking": ranking(),
  "/coach": coach(),
  "/coachalternativos": coachalternativos(),
  "/lider": lider(),
  "/fundadores": fundadores(),
  "/ceo": ceo(),
  "/criada": criada(),
  "/ganhos": ganhos(),
  "/jogos": jogos(),
  "/ondefica": ondefica(),
  "/exjogadores": exjogadores(),
  "/jogadoresinativos": jogadoresinativos(),
  "/desconhecido": desconhecido(),
};

export async function cumprimento(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  return `Salve, Furioso! Como posso te ajudar hoje?`;
}

export async function executeCommand(command: keyof typeof commands): Promise<string> {
  if (await commands[command]) {
    return commands[command];
  } else {
    return commands["/desconhecido"];
  }
}

async function proximojogo(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  const jogo = data && 'upcomingTournaments' in data ? data.upcomingTournaments?.[0] : undefined;
  return jogo
    ? `Fica ligado, Furioso! O próximo confronto da FURIA vai rolar no **${jogo.tournamentName}**, marcado entre **${jogo.date}**.`
    : "Sem jogos marcados por enquanto. Bora torcer por novidades!";
}

async function proximosjogos(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  const jogos = data && 'upcomingTournaments' in data ? data.upcomingTournaments : [];
  return jogos.length
    ? `Anota aí, Furioso! Os próximos campeonatos da FURIA são: ${jogos.map(j => `${j.tournamentName} - ${j.date}`).join(", ")}.`
    : "Nada na agenda por enquanto. A tropa tá se preparando!";
}

async function ultimosjogos(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  const jogos = data && 'matchHistory' in data ? data.matchHistory?.matches?.slice(0, 5) : [];
  return jogos?.length
    ? `Se liga nos últimos embates da FURIA: ${jogos.map(j => `${j.date} - ${j.tournament} contra ${j.opponent} (${j.result})`).join(", ")}.`
    : "Sem histórico recente por aqui.";
}

async function elenco(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  const jogadores = data && 'roster' in data && data.roster?.active?.map(p => `${p.fullName.split(" ")[0]} \"${p.username}\" ${p.fullName.split(" ")[1]}`).join(", ");
  return jogadores ? `A tropa tá formada assim ó: ${jogadores}.` : "Erro ao buscar o elenco.";
}

async function ranking(): Promise<string> {
  return "Ranking não disponível.";
  // const data = furiaData;
  // if (typeof data === "string") return data;
  // return data && 'teamInfo' in data && data.teamInfo?.["Ranking"]
  //   ? `A FURIA tá ocupando a posição ${data.teamInfo.Ranking} no ranking atual!`
  //   : "Ranking não disponível.";
}

async function coach(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  return data && 'teamInfo' in data && Array.isArray(data.teamInfo?.coaches) && data.teamInfo.coaches.length
    ? `Quem comanda a tropa é ele, o monstro: **${data.teamInfo.coaches[0]}**!`
    : "Coach não encontrado.";
}

async function coachalternativos(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  const lista = data && 'teamInfo' in data && Array.isArray(data.teamInfo.coaches) ? data.teamInfo.coaches.join(", ") : undefined;
  return lista ? `Todos os coaches da FURIA até agora: ${lista}.` : "Não encontrei os coaches.";
}

async function lider(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  return data && 'teamInfo' in data && data.teamInfo?.["in-game_leader"] ? `O IGL da tropa é o **${data.teamInfo["in-game_leader"]}**.` : "Não achei o líder do time.";
}

async function fundadores(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  const nomes = data && 'teamInfo' in data && Array.isArray(data.teamInfo?.founders) ? data.teamInfo.founders.join(", ") : undefined;
  return nomes ? `Os fundadores da FURIA são: ${nomes}. Respeita a história!` : "Fundadores não encontrados.";
}

async function ceo(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  const nomes = data && typeof data !== "string" && 'teamInfo' in data && Array.isArray(data.teamInfo?.ceo) 
    ? data.teamInfo.ceo.join(", ") 
    : data && typeof data !== "string" && 'teamInfo' in data 
    ? data.teamInfo?.ceo 
    : undefined;
  return nomes ? `Na chefia da FURIA estão: ${nomes}.` : "Não encontrei os CEOs.";
}

async function criada(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  return data && 'teamInfo' in data && data.teamInfo?.created 
    ? `A FURIA nasceu em ${typeof data.teamInfo.created === "string" ? data.teamInfo.created.split(":").filter(Boolean)[0] : data.teamInfo.created[0]}. Que trajetória, hein?` 
    : "Data de criação indisponível.";
}

async function ganhos(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  return data && 'teamInfo' in data && data.teamInfo?.["approx._total_winnings"] 
    ? `A FURIA já acumulou cerca de ${data.teamInfo["approx._total_winnings"]} em premiações. É muita bala!` 
    : "Ganhos não encontrados.";
}

async function jogos(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  return data && 'teamInfo' in data && data.teamInfo?.games ? `A FURIA compete em: ${data.teamInfo.games}.` : "Jogos não especificados.";
}

async function ondefica(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  return data && 'teamInfo' in data && data.teamInfo?.location 
    ? `A FURIA é braba lá do ${data.teamInfo.location}, representando a região ${data.teamInfo.region}.` 
    : "Localização não informada.";
}

async function exjogadores(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  const lista = data && typeof data !== "string" && 'roster' in data && data.roster?.former?.map(p => `${p.fullName} (\"${p.username}\")`).join(", ");
  return lista ? `Já passaram pela tropa: ${lista}. História pesada!` : "Nenhum ex-jogador encontrado.";
}

async function jogadoresinativos(): Promise<string> {
  const data = furiaData;
  if (typeof data === "string") return data;
  const lista = data && 'roster' in data && data.roster?.inactive?.map(p => `${p.fullName} (\"${p.username}\")`).join(", ");
  return lista ? `Atualmente inativos: ${lista}.` : "Nenhum jogador inativo no momento.";
}

async function desconhecido(): Promise<string> {
  return "Hmm... não entendi muito bem, Furioso. Tenta perguntar de outro jeito aí 😉";
}
