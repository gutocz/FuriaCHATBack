import axios from 'axios';
import { load } from 'cheerio';
import fs from 'fs';
import {
  getActivePlayers,
  getInactivePlayers,
  getFormerPlayers,
  getUpcomingTournaments,
  getTeamInfo,
  getMatchHistory
} from './utils';

const URL = 'https://liquipedia.net/counterstrike/FURIA';
const MATCHES_URL = 'https://liquipedia.net/counterstrike/FURIA/Matches';

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

interface TeamInfo {
  [key: string]: string | string[];
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

interface FuriaData {
  organizationName: string;
  teamInfo: TeamInfo;
  roster: {
    active: Player[];
    inactive: Player[];
    former: Player[];
  };
  upcomingTournaments: Tournament[];
  matchHistory: {
    matches: Match[];
  };
}

export async function scrapeFuria(): Promise<FuriaData | string | void> {
  try {

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      'Accept-Language': 'en-US,en;q=0.9',
    };

    await delay(2000);
    const { data } = await axios.get(URL, { headers });
    const $ = load(data) as cheerio.CheerioAPI;

    const { data: matchData } = await axios.get(MATCHES_URL);
    const $$ = load(matchData) as cheerio.CheerioAPI;

    const organizationName = $('#firstHeading').text().trim();
    const players = getActivePlayers($);
    const inactivePlayers = getInactivePlayers($);
    const formerPlayers = getFormerPlayers($);
    const upcomingTournaments = getUpcomingTournaments($);
    const teamInfo = getTeamInfo($);
    const matchHistory = getMatchHistory($$);

    const result: FuriaData = {
      organizationName,
      teamInfo,
      roster: {
        active: players,
        inactive: inactivePlayers,
        former: formerPlayers
      },
      upcomingTournaments,
      matchHistory: {
        matches: matchHistory
      }
    };

    return result;
  } catch (error) {
    console.error('Erro ao raspar os dados:', error);
  }
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

scrapeFuria();
