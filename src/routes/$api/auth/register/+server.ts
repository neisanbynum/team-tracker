import { APIData } from '$lib/api/APIData';
import { APIResponse } from '$lib/api/APIResponse';
import { status } from '$lib/api/APIStatus';
import { User, UserAuth } from '$lib/database/index.js';
import {
	RegisterAuthSchema,
	RegisterFormSchema,
	RegisterProfileSchema
} from '$lib/schemas/forms/authenticate.js';

export const POST = async (event) => {
	const request = await APIData(event.request);
	if (!request) {
		console.log('No Request Data');
		return APIResponse(false, status.BAD_REQUEST, 'No Request Data');
	}

	const validate = await RegisterFormSchema.safeParseAsync(request);
	if (!validate.success) {
		console.log('Invalid Register Data');
		return APIResponse(false, status.BAD_REQUEST, 'Invalid Register Data');
	}

	const body = validate.data;

	const authexists = await UserAuth.findOne({ dodid: body.dodid });
	if (authexists) {
		console.log('User Auth Already Exists');
		return APIResponse(false, status.CONFLICT, 'User Already Exists');
	}

	const profileexists = await User.findOne({ dodid: body.dodid });
	if (profileexists) {
		console.log('User Profile Already Exists');
		return APIResponse(false, status.CONFLICT, 'User Already Exists');
	}

	let username =
		`${body.first}.${body.middle ? `${body.middle[0]}.` : ''}${body.last}`.toLowerCase();
	const usernameexists = await UserAuth.findOne({ username });
	if (usernameexists) {
		let modifier = 1;
		do {
			modifier++;
		} while (await UserAuth.findOne({ username: `${username}${modifier}` }));
		username = `${username}${modifier}`;
	}

	const validauth = await RegisterAuthSchema.safeParseAsync({
		dodid: body.dodid,
		username,
		password: body.password
	});
	if (!validauth.success) {
		console.log('Invalid Register Auth Data');
		return APIResponse(false, status.BAD_REQUEST, 'Invalid Register Auth Data');
	}

	const validprofile = await RegisterProfileSchema.safeParseAsync({
		dodid: body.dodid,
		rank: body.rank,
		name: {
			first: body.first,
			middle: body.middle,
			last: body.last,
			prefermiddle: body.prefermiddle
		}
	});
	if (!validprofile.success) {
		console.log('Invalid Register Profile Data');
		return APIResponse(false, status.BAD_REQUEST, 'Invalid Register Profile Data');
	}

	const auth = new UserAuth(validauth.data);
	await auth.save();

	const profile = new User(validprofile.data);
	await profile.save();

	return APIResponse(true, status.CREATED, { username: auth.username });
};
