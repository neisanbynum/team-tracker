import z from 'zod/v4';
import {
	JuniorEnlistedRanks,
	Ranks,
	SeniorEnlistedRanks,
	WarrantOfficerRanks,
	CommissionedOfficerRanks,
	GeneralOfficerRanks
} from './constants';

export const DODIDValidation = z.coerce
	.string('Invalid DoD ID Value Type')
	.regex(/^[0-9]{10}$/, 'Invalid DoD ID');

export const JuniorEnlistedRankValidation = z.enum(
	JuniorEnlistedRanks,
	'Invalid Junior Enlisted Rank'
);
export const SeniorEnlistedRankValidation = z.enum(
	SeniorEnlistedRanks,
	'Invalid Senior Enlisted Rank'
);
export const WarrantOfficerRankValidation = z.enum(
	WarrantOfficerRanks,
	'Invalid Warrant Officer Rank'
);
export const CommissionedOfficerRankValidation = z.enum(
	CommissionedOfficerRanks,
	'Invalid Commissioned Officer Rank'
);
export const GeneralOfficerRankValidation = z.enum(
	GeneralOfficerRanks,
	'Invalid General Officer Rank'
);
export const RankValidation = z.enum(Ranks, 'Invalid Rank');

export const NameValidation = z.string().regex(/^[A-Z][a-zA-Z-']{2,}$/, 'Invalid Name');
export const FullNameValidation = z.object({
	last: NameValidation,
	first: NameValidation,
	middle: NameValidation.nullish(),
	prefermiddle: z.boolean()
});

export const UsernameValidation = z
	.string()
	.regex(/^[a-z]{2,}\.([a-z]{1}\.)?[a-z]{2,}$/, 'Invalid Username');

export const PasswordValidation = z
	.string()
	.regex(
		/^(?=(?:.*\d){3,})(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])[\s\S]{8,}$/,
		'Invalid Password'
	);
