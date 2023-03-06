import { Stats } from '@olros/stats';

const TEAM = 'tihlde-pythons';
const PROJECT = 'registrering';

export const stats = Stats({ team: TEAM, project: PROJECT, allowLocalhost: true });
