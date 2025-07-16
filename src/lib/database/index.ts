import { DB_CONNECTION_STRING, SECURED_DB_NAME, UNCLASSIFIED_DB_NAME } from '$env/static/private';
import mongoose from 'mongoose';
import { UserAuthSchema } from './secure/userauth';
import { UserSchema } from './unclassified/user';

const secured = mongoose.createConnection(DB_CONNECTION_STRING, {
	dbName: SECURED_DB_NAME
});
const unclassified = mongoose.createConnection(DB_CONNECTION_STRING, {
	dbName: UNCLASSIFIED_DB_NAME
});

export const UserAuth = secured.model("UserAuth", UserAuthSchema)
export const User = unclassified.model("User", UserSchema)