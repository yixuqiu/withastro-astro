export const formContentTypes = ['application/x-www-form-urlencoded', 'multipart/form-data'];

export function hasContentType(contentType: string, expected: string[]) {
	// Split off parameters like charset or boundary
	// https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type#content-type_in_html_forms
	const type = contentType.split(';')[0].toLowerCase();

	return expected.some((t) => type === t);
}

export type MaybePromise<T> = T | Promise<T>;

export async function getAction(
	pathKeys: string[]
): Promise<(param: unknown) => MaybePromise<unknown>> {
	let { server: actionLookup } = await import(import.meta.env.ACTIONS_PATH);
	for (const key of pathKeys) {
		if (!(key in actionLookup)) {
			throw new Error('Action not found');
		}
		actionLookup = actionLookup[key];
	}
	if (typeof actionLookup !== 'function') {
		throw new Error('Action not found');
	}
	return actionLookup;
}
