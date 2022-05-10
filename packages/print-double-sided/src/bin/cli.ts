import inquirer from 'inquirer';
import PressToContinue from 'inquirer-press-to-continue';
import { nanoid } from 'nanoid-nice';

import {
	deletePreset,
	saveCurrentSettingsAsPreset,
	selectPreset,
} from '~/utils/preset.js';
import { clickPrintButton } from '~/utils/print-button.js';
import { openPrintMenu } from '~/utils/print-menu.js';
import { selectPrintOddEvenPages } from '~/utils/print-panel.js';

inquirer.registerPrompt('press-to-continue', PressToContinue);

const temporaryPresetName = nanoid();
await saveCurrentSettingsAsPreset({ presetName: temporaryPresetName });

// Printing odd pages
await selectPrintOddEvenPages({ odd: true });
await clickPrintButton();

await inquirer.prompt({
	type: 'press-to-continue',
	name: 'key',
	pressToContinueMessage:
		'Once the pages are finished printing, please re-insert the pages into the printer, and then press enter to continue...',
	enter: true,
});

// Printing even pages
await openPrintMenu();
await selectPreset({ presetName: temporaryPresetName });
await selectPrintOddEvenPages({ even: true });
await clickPrintButton();

// Cleanup
await openPrintMenu();
await deletePreset({ presetName: temporaryPresetName });
