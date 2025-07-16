import { Schema, type InferSchemaType } from 'mongoose';
import bcrypt from 'bcrypt';
import { PASSWORD_PEPPER } from '$env/static/private';
import z from 'zod/v4';
import {
	DODIDValidation,
	PasswordValidation,
	UsernameValidation
} from '$lib/schemas/utils/segments';

export const UserAuthValidation = z.object({
	dodid: DODIDValidation,
	username: UsernameValidation,
	password: PasswordValidation,
	attempts: z
		.number('Invalid User Auth Attempts Value Type')
		.int('Invalid User Auth Attempts Value Type')
		.default(0),
	locked: z.boolean('Invalid User Auth Locked Value Type').default(false)
});
export type UserAuthValidation = typeof UserAuthValidation
export type UserAuthValidationShape = z.core.output<UserAuthValidation>

const UserAuthSchema = new Schema(
	{
		dodid: { type: String, required: true, unique: true },
		username: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		attempts: { type: Number, required: true, default: 0 },
		locked: { type: Boolean, required: true, default: false }
	},
	{
		collection: 'userauth',
		methods: {
			authenticate(password: FormDataEntryValue | null) {
				const resolve = (valid: boolean) => {
					if (valid) return true;

					this.attempts++;
					if (this.attempts >= 3) this.locked = true;
					return false;
				};

				if (!password || password instanceof File) return resolve(false);
				return resolve(bcrypt.compareSync(password + PASSWORD_PEPPER, this.password));
			}
		},
		query: {
			byUsername(username: string) {
				return this.where({ username });
			},
			byDODID(dodid: string) {
				return this.where({ dodid });
			}
		}
	}
);

UserAuthSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password + PASSWORD_PEPPER, 10);
	return next();
});

type UserAuthDocument = InferSchemaType<typeof UserAuthSchema>;

export { UserAuthSchema, type UserAuthDocument };
