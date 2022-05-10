import type { ElementReference } from 'applescript-utils';
import {
	clickElement,
	setTextFieldValue,
	waitForElementMatch,
} from 'applescript-utils';
import { nanoid } from 'nanoid-nice';

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

export async function saveCurrentSettingsAsTemporaryPreset() {
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

	const presetName = nanoid();
	await setTextFieldValue(presetNameTextInputElement, presetName);

	const okButton = await waitForElementMatch('Preview', (element) =>
		element.path.some((part) => part.type === 'button' && part.name === 'OK')
	);

	await clickElement(okButton);
}
