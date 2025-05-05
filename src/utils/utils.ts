import * as cheerio from 'cheerio';

interface Player {
  username: string;
  fullName: string;
  joinDate?: string;
  inactiveDate?: string;
}

interface Tournament {
  tournamentName: string;
  date: string;
}

interface Match {
  date: string;
  tier: string;
  type: string;
  game: string;
  tournament: string;
  participant: string;
  score: string;
  opponent: string;
  result: 'win' | 'lose' | 'draw';
}

interface TeamInfo {
  [key: string]: string | string[];
}

export function getActivePlayers($: cheerio.CheerioAPI): Player[] {
  const actives: Player[] = [];
  $('span#Active').closest('h3').nextAll('div.table-responsive').first().find('tr.Player').each((_, el) => {
    const username = $(el).find('td.ID a').text().trim();
    const fullName = $(el).find('td.Name .LargeStuff').text().trim();
    const joinDate = $(el).find('td.Date').first().text().trim();
    if (username) {
      actives.push({ username, fullName, joinDate });
    }
  });
  return actives;
}

export function getInactivePlayers($: cheerio.CheerioAPI): Player[] {
  const inactives: Player[] = [];
  $('span#Inactive').closest('h3').nextAll('div.table-responsive').first().find('tr.Player').each((_, el) => {
    const username = $(el).find('td.ID a').text().trim();
    const fullName = $(el).find('td.Name .LargeStuff').text().trim();
    const joinDate = $(el).find('td.Date').first().text().trim();
    const inactiveDate = $(el).find('td.Date').last().text().trim();
    if (username) {
      inactives.push({ username, fullName, joinDate, inactiveDate });
    }
  });
  return inactives;
}

export function getFormerPlayers($: cheerio.CheerioAPI): Player[] {
  const formers: Player[] = [];
  $('span#Former').closest('h3').nextAll('div.table-responsive').first().find('tr.Player').each((_, el) => {
    const username = $(el).find('td.ID a').text().trim();
    const fullName = $(el).find('td.Name .LargeStuff').text().trim();
    if (username) {
      formers.push({ username, fullName });
    }
  });
  return formers;
}

export function getUpcomingTournaments($: cheerio.CheerioAPI): Tournament[] {
  const tournaments: Tournament[] = [];
  $('div:contains("Upcoming Tournaments")').nextAll('table.wikitable').each((_, table) => {
    const tournamentName = $(table).find('td.versus a').last().text().trim();
    const date = $(table).find('td.match-filler .text-nowrap').last().text().trim();
    if (tournamentName && date) {
      tournaments.push({ tournamentName, date });
    }
  });
  return tournaments;
}

export function getTeamInfo($: cheerio.CheerioAPI): TeamInfo {
  const info: TeamInfo = {};
  $('.infobox-cell-2.infobox-description').each((_, el) => {
    const label = $(el).text().trim().replace(':', '');
    const key = label.toLowerCase().replace(/\s/g, '_');

    if (label === 'Founders' || label === 'CEO') {
      const text = $(el).next().text().trim();
      const names = text.split(' ');
      const formatted = [];
      for (let i = 0; i < names.length; i += 2) {
        formatted.push(`${names[i]} ${names[i + 1]}`);
      }
      info[key] = formatted;
    } else if (label === 'Coaches') {
      const coachs = $(el).next().text().trim().split(' ');
      info[key] = coachs;
    } else if (label !== 'Manager') {
      const value = $(el).next().text().trim();
      if (value) {
        info[key] = value;
      }
    }
  });
  return info;
}

export function getMatchHistory($: cheerio.CheerioAPI): Match[] {
  const matches: Match[] = [];
  $('table.wikitable.wikitable-striped tbody tr').each((_, row) => {
    const columns = $(row).find('td');
    if (columns.length >= 9) {
      const date = $(columns[0]).find('.timer-object-date').text().trim() || $(columns[0]).text().trim();
      const tier = $(columns[1]).text().trim();
      const type = $(columns[2]).text().trim();
      const game = $(columns[3]).find('img').attr('alt') || '';
      const tournament = $(columns[5]).text().trim();
      const participant = $(columns[6]).text().trim();
      const score = $(columns[7]).text().trim().replace(/\s+/g, ' ');
      const opponent = $(columns[8]).text().trim();
      const scoreFur = parseInt(score.slice(0, 2));
      const scoreOpp = parseInt(score.slice(3, 5));
      const result: 'win' | 'lose' | 'draw' =
        scoreFur > scoreOpp ? 'win' : scoreFur < scoreOpp ? 'lose' : 'draw';

      if (date && tournament && opponent) {
        matches.push({
          date,
          tier,
          type,
          game,
          tournament,
          participant,
          score,
          opponent,
          result
        });
      }
    }
  });
  return matches.slice(0, 10);
}
