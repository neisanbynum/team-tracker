import { Schema, type InferSchemaType } from 'mongoose';
import { Ranks } from '$lib/schemas/utils/constants';

const NameSchema = new Schema({
	last: { type: String, required: true },
	first: { type: String, required: true },
	middle: { type: String, required: false },
	prefermiddle: { type: Boolean, required: true, default: false }
});
type NameDocument = InferSchemaType<typeof NameSchema>;

const fullname = (name: NameDocument) => {
	return `${name.last}, ${name.first} ${name.middle ?? ''}`.trim();
};

const shortname = (name: NameDocument) => {
	return `${name.prefermiddle && name.middle ? name.middle : name.first} ${name.last}`.trim();
};

const UserSchema = new Schema(
	{
		dodid: { type: String, required: true, unique: true },
		rank: { type: String, required: true, enum: Ranks },
		name: { type: NameSchema, required: true }
	},
	{
		collection: 'user',
		virtuals: {
			fullname: {
				get() {
					return fullname(this.name)
				}
			},
			fullrankname: {
				get() {
					return `${this.rank} ${fullname(this.name)}`;
				}
			},
			shortrankname: {
				get() {
					return `${this.rank} ${shortname(this.name)}`
				}
			}
		},
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

type UserDocument = InferSchemaType<typeof UserSchema>;

export { UserSchema, type UserDocument };
