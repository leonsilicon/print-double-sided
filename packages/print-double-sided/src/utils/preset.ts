import type { BaseElementReference, ElementReference } from 'applescript-utils';
import {
	clickElement,
	getElementProperties,
	getElements,
	getTableRows,
	getTextFieldValue,
	selectTableRow,
	setTextFieldValue,
	waitForElementMatch,
} from 'applescript-utils';
import zip from 'just-zip-it';

export async function getPresetsDropdownElement(): Promise<ElementReference> {
	const printerLabel = await waitForElementMatch('Preview', (element) =>
		element.path.some(
			(part) => part.type === 'static text' && part.name === 'Presets:'
		)
	);

	// If the previous element is the "Printer:" label, the current element is the Presets selection box
	const printerDropdownElement = printerLabel.nextElement();

	if (printerDropdownElement === undefined) {
		throw new Error('Printer dropdown element not found.');
	}

	return printerDropdownElement;
}

export async function saveCurrentSettingsAsPreset({
	presetName,
}: {
	presetName: string;
}) {
	const presetsDropdownElement = await getPresetsDropdownElement();
	await clickElement(presetsDropdownElement);

	const saveCurrentSettingsAsPresetMenuItem = await waitForElementMatch(
		'Preview',
		(element) =>
			element.path.some(
				(part) =>
					part.type === 'menu item' &&
					part.name.startsWith('Save Current Settings as Preset')
			)
	);

	await clickElement(saveCurrentSettingsAsPresetMenuItem);

	const presetNameLabelElement = await waitForElementMatch(
		'Preview',
		(element) =>
			element.path.some((part) => part.name.startsWith('Preset Name'))
	);

	const presetNameTextInputElement = presetNameLabelElement.nextElement();
	if (presetNameTextInputElement === undefined) {
		throw new Error('Preset name text input element was not found.');
	}

	await setTextFieldValue(presetNameTextInputElement, presetName);

	const okButton = await waitForElementMatch('Preview', (element) =>
		element.path.some((part) => part.type === 'button' && part.name === 'OK')
	);

	await clickElement(okButton);
}

export async function selectPreset({ presetName }: { presetName: string }) {
	const presetsDropdownElement = await getPresetsDropdownElement();
	await clickElement(presetsDropdownElement);

	const presetMenuItem = await waitForElementMatch('Preview', (element) =>
		element.path.some(
			(part) => part.type === 'menu item' && part.name === presetName
		)
	);
	await clickElement(presetMenuItem);
}

export async function deletePreset({ presetName }: { presetName: string }) {
	const presetsDropdownElement = await getPresetsDropdownElement();
	await clickElement(presetsDropdownElement);

	const showPresetsMenuItem = await waitForElementMatch('Preview', (element) =>
		element.path.some(
			(part) =>
				part.type === 'menu item' && part.name.startsWith('Show Presets')
		)
	);
	await clickElement(showPresetsMenuItem);

	const presetsTable = await waitForElementMatch('Preview', (element) =>
		element.path.some((part) => part.fullName === 'table 1')
	);

	const tableRows = await getTableRows(presetsTable);
	const previewElements = await getElements('Preview');

	let presetRow: BaseElementReference | undefined;
	for (const tableRow of tableRows) {
		const textField = previewElements.find(
			(previewElement) =>
				previewElement.pathString.includes(tableRow.pathString) &&
				previewElement.path[0]?.type === 'text field'
		);
		if (textField === undefined) {
			throw new Error(
				`Could not find text field for row ${tableRow.path[0]!.fullName}`
			);
		}

		// eslint-disable-next-line no-await-in-loop
		const textFieldValue = await getTextFieldValue(textField);
		if (textFieldValue === presetName) {
			presetRow = tableRow;
		}
	}

	if (presetRow === undefined) {
		throw new Error(
			`Could not find preset row matching preset name ${presetName}`
		);
	}

	await selectTableRow({ row: presetRow });

	const elements = await getElements('Preview');
	const buttonElements = elements.filter(
		(element) => element.path[0]?.type === 'button'
	);
	const buttonElementProperties = zip(
		buttonElements,
		await getElementProperties(buttonElements)
	);

	const removePresetButton = buttonElementProperties.find(
		([_buttonElement, properties]) => properties.description === 'remove'
	)?.[0];
	if (removePresetButton === undefined) {
		throw new Error('Could not find remove preset button.');
	}

	await clickElement(removePresetButton);

	const okButton = elements.find((element) =>
		element.path.some((part) => part.type === 'button' && part.name === 'OK')
	);

	if (okButton === undefined) {
		throw new Error('Could not find OK button.');
	}

	await clickElement(okButton);
}
