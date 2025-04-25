const commands: Record<string, Promise<string>> = {
    "/proximojogo": proximojogo(),
    "/proximosjogos": proximosjogos(),
    "/elenco": elenco(),
    "/ranking": ranking(),
    "/coach": coach(),
    "/desconhecido": desconhecido(),
};

export async function executeCommand(command: keyof typeof commands): Promise<string> {
    if (await commands[command]) {
        return commands[command];
    } else {
        return commands["/desconhecido"];
    }
}

async function proximojogo(): Promise<string> {
  return "O próximo jogo da FURIA é contra a equipe XYZ no dia 15 de outubro.";
}

async function proximosjogos(): Promise<string> {
    return "Os próximos jogos da FURIA serão no Sábado e no Domingo.";
}

async function elenco(): Promise<string> {
    return "Os jogadores do time são: Jogador 1, Jogador 2, Jogador 3.";
}

async function ranking(): Promise<string> {
    return "A FURIA está atualmente na posição 5 do ranking.";
}

async function coach(): Promise<string> {
    return "O técnico Guerri disse: 'Estamos focados e prontos para o próximo desafio.'";
}

async function desconhecido(): Promise<string> {
    return "Desculpe, não consegui entender sua solicitação.";
}