import type { ElementReference } from 'applescript-utils';
import { clickElement, waitForElementMatch } from 'applescript-utils';

export async function getPrintPanelDropdownElement(): Promise<ElementReference> {
	const printPanelDropdown = await waitForElementMatch(
		'Preview',
		(element) =>
			element.path.some((part) => part.fullName === 'pop up button 4') &&
			element.path.some((part) => part.fullName === 'splitter group 1')
	);

	return printPanelDropdown;
}

export async function selectPrintOddEvenPages({
	odd,
	even,
}: {
	odd?: boolean;
	even?: boolean;
}) {
	if (odd === even) {
		throw new Error(
			'Exactly one of either `odd` or `even` should be specified.'
		);
	}

	const printPanelDropdownElement = await getPrintPanelDropdownElement();
	await clickElement(printPanelDropdownElement);

	const paperHandlingMenuItem = await waitForElementMatch(
		'Preview',
		(element) =>
			element.path.some(
				(part) => part.type === 'menu item' && part.name === 'Paper Handling'
			)
	);
	await clickElement(paperHandlingMenuItem);

	const pagesToPrintLabel = await waitForElementMatch('Preview', (element) =>
		element.path.some((part) => part.name === 'Pages to Print:')
	);
	const pagesToPrintDropdown = pagesToPrintLabel.nextElement();
	if (pagesToPrintDropdown === undefined) {
		throw new Error('Pages to print dropdown not found.');
	}

	await clickElement(pagesToPrintDropdown);

	const oddEvenPagesMenuItem = await waitForElementMatch('Preview', (element) =>
		element.path.some(
			(part) =>
				part.type === 'menu item' &&
				part.name === (odd ? 'Odd Only' : 'Even Only')
		)
	);

	await clickElement(oddEvenPagesMenuItem);
}

export async function selectPageOrder({ reverse }: { reverse: boolean }) {
	const printPanelDropdownElement = await getPrintPanelDropdownElement();
	await clickElement(printPanelDropdownElement);

	const paperHandlingMenuItem = await waitForElementMatch(
		'Preview',
		(element) =>
			element.path.some(
				(part) => part.type === 'menu item' && part.name === 'Paper Handling'
			)
	);
	await clickElement(paperHandlingMenuItem);

	const pageOrderLabel = await waitForElementMatch('Preview', (element) =>
		element.path.some((part) => part.name === 'Page Order:')
	);
	const pageOrderDropdown = pageOrderLabel.nextElement();
	if (pageOrderDropdown === undefined) {
		throw new Error('Page order dropdown not found.');
	}

	await clickElement(pageOrderDropdown);

	const pageOrderMenuItem = await waitForElementMatch('Preview', (element) =>
		element.path.some(
			(part) =>
				part.type === 'menu item' &&
				part.name === (reverse ? 'Reverse' : 'Normal')
		)
	);

	await clickElement(pageOrderMenuItem);
}
