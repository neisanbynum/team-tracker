import { APIData } from '$lib/api/APIData.js';
import { APIResponse } from '$lib/api/APIResponse.js';
import { status } from '$lib/api/APIStatus.js';
import { User, UserAuth } from '$lib/database/index.js';
import { LoginFormSchema } from '$lib/schemas/forms/authenticate.js';

export const POST = async (event) => {
	const request = await APIData(event.request);
	if (!request) {
		return APIResponse(false, status.BAD_REQUEST, 'No Request Data');
	}

	const form = await LoginFormSchema.safeParseAsync(request);
	if (!form.success) {
		return APIResponse(false, status.UNPROCESSABLE_ENTITY, 'Invalid Login Data');
	}

	const { data } = form;

	const auth = await UserAuth.findOne().byUsername(data.username);
	if (!auth) {
		return APIResponse(false, status.UNAUTHORIZED, 'Invalid Username/Password');
	}

	const authenticated = auth.authenticate(data.password);
	if (!authenticated) {
		await auth.save();
		return APIResponse(
			false,
			auth.locked ? status.LOCKED : status.UNAUTHORIZED,
			auth.locked
				? 'Attempts Exceeded; Contact Team Leader to Unlock Account'
				: 'Invalid Username/Password'
		);
	}

	if (auth.locked) {
		return APIResponse(
			false,
			status.LOCKED,
			'Account Locked; Contact Team Leader to Unlock Account'
		);
	}

	auth.attempts = 0;
	await auth.save();

	const profile = await User.findOne({ dodid: auth.dodid });
	if (!profile) {
		return APIResponse(false, status.UNAUTHORIZED, 'User Profile Not Found');
	}

	return APIResponse(true, status.ACCEPTED, { shortrankname: profile.get('shortrankname') });
};
