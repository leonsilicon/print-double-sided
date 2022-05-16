import { waitForElementMatch } from 'applescript-utils';

export async function getNumPagesToPrint() {
	const pageOfElement = await waitForElementMatch(
		'Preview',
		(element) =>
			(element.path[0]?.type === 'static text' &&
				element.path[0]?.name.includes(' of ') &&
				element.path[1]?.fullName === 'splitter group 1') ??
			false
	);

	const pageOfText = pageOfElement.path[0]?.name;
	if (pageOfText === undefined) {
		throw new Error('Could not get num pages to print.');
	}

	const numPagesToPrintString = pageOfText.split(' of ').at(-1);
	if (numPagesToPrintString === undefined) {
		throw new Error('Could not get num pages to print.');
	}

	return Number(numPagesToPrintString);
}
