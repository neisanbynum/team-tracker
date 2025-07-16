export const JuniorEnlistedRanks = ['PVT', 'PV2', 'PFC', 'SPC', 'CPL', 'SGT', 'SSG'] as const;
export const SeniorEnlistedRanks = ['SFC', 'MSG', '1SG', 'SGM', 'CSM'] as const;
export const WarrantOfficerRanks = ['WO1', 'CW2', 'CW3', 'CW4', 'CW5'] as const;
export const CommissionedOfficerRanks = ['CDT', '2LT', '1LT', 'CPT', 'MAJ', 'LTC', 'COL'] as const;
export const GeneralOfficerRanks = ['BG', 'MG', 'LTG', 'GEN'] as const;
export const Ranks = [
	...JuniorEnlistedRanks,
	...SeniorEnlistedRanks,
	...WarrantOfficerRanks,
	...CommissionedOfficerRanks,
	...GeneralOfficerRanks
] as const;
