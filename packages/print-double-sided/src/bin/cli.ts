import { program } from 'commander';
import { join } from 'desm';
import { execaSync } from 'execa';
import inquirer from 'inquirer';
import PressToContinue from 'inquirer-press-to-continue';
import { nanoid } from 'nanoid-nice';

import { getNumPagesToPrint } from '~/utils/num-pages.js';
import {
	deletePreset,
	saveCurrentSettingsAsPreset,
	selectPreset,
} from '~/utils/preset.js';
import { clickPrintButton } from '~/utils/print-button.js';
import { closePrintMenu, openPrintMenu } from '~/utils/print-menu.js';
import {
	selectPageOrder,
	selectPrintOddEvenPages,
} from '~/utils/print-panel.js';

inquirer.registerPrompt('press-to-continue', PressToContinue);

program
	.showHelpAfterError()
	.argument('[input-file]', 'the path to the file to print')
	.parse();

const filePath = program.args[0];

if (filePath !== undefined) {
	execaSync('open', [filePath]);
}

await openPrintMenu();
await inquirer.prompt({
	type: 'press-to-continue',
	name: 'key',
	key: 'c',
	pressToContinueMessage:
		'Customize the print settings until you are happy with them (but do NOT press Print!), then press `c` to continue...',
});

const numPagesToPrint = await getNumPagesToPrint();
const temporaryPresetName = nanoid();
await saveCurrentSettingsAsPreset({ presetName: temporaryPresetName });

// Printing even pages in reverse
await selectPrintOddEvenPages({ odd: true });
await selectPageOrder({ reverse: true });
await clickPrintButton();

await inquirer.prompt({
	type: 'press-to-continue',
	name: 'key',
	pressToContinueMessage:
		'Once the pages are finished printing, please re-insert the pages into the printer, and then press enter to continue...',
	enter: true,
});

// Printing odd pages in reverse
await openPrintMenu();
await selectPreset({ presetName: temporaryPresetName });
await selectPrintOddEvenPages({ even: true });
await selectPageOrder({ reverse: false });
await clickPrintButton();

if (numPagesToPrint % 2 === 1) {
	// Print an extra blank page if the number of pages is odd
	execaSync('lp', [join(import.meta.url, '../../assets/blank.pdf')]);
}

// Cleanup
await openPrintMenu();
await deletePreset({ presetName: temporaryPresetName });
await closePrintMenu();
