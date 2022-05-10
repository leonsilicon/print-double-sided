import { clickElement, waitForElementMatch } from 'applescript-utils';

export async function clickPrintButton() {
	const printButton = await waitForElementMatch(
		'Preview',
		(element) =>
			element.path[0]?.type === 'button' && element.path[0].name === 'Print'
	);

	await clickElement(printButton);
}
