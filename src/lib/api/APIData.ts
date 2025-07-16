export async function APIData(request: Request | Response) {
	const stream = (await request.body?.getReader().read())?.value;
	if (!stream) return;

	return JSON.parse(new TextDecoder('utf-8').decode(stream));
}