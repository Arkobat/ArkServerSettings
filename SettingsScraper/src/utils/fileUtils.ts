import fs from "fs";
import path from "path";
import { ConfigFile, TableRow, TransformedSetting } from "../types/index.js";

/**
 * Determines if a default value is valid for inclusion in config files
 */
export function isValidDefaultValue(input: string | undefined): boolean {
	if (!input) return false;

	const lower = input.toLowerCase();
	if (lower === "true" || lower === "false") {
		return true;
	}

	const num = Number(input);
	return Number.isFinite(num);
}

/**
 * Transform a table row into a setting object
 */
export function transformSetting(
	setting: TableRow
): TransformedSetting | undefined {
	return {
		Variable: setting.Variable,
		DefaultValue: isValidDefaultValue(setting.DefaultValue)
			? setting.DefaultValue!
			: "N/A",
		Description: setting.Description,
	};
}

/**
 * Generate configuration file content
 */
export function generateConfigContent(data: ConfigFile): string {
	let content = "";

	// Loop over all sections of the file
	for (const section of data.headers) {
		content += `${section.header}\n`;

		// Loop over all settings of the section
		for (const setting of section.table) {
			// Add comments to the setting
			const lines = setting.Description?.split("\n");
			lines?.forEach((line) => {
				content += `# ${line}\n`;
			});

			// Add the setting, with its default value
			if (isValidDefaultValue(setting.DefaultValue)) {
				content += `${setting.Variable}=${setting.DefaultValue}`;
			} else {
				content += `#${setting.Variable}=N/A`;
			}
			content += "\n\n";
		}

		content += "\n\n";
	}

	return content;
}

/**
 * Save content to a file, ensuring the directory exists
 */
export function saveToFile(fileName: string, content: string): void {
	const dir = path.dirname(fileName);
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(fileName, content);
}

/**
 * Save JSON data to a file, ensuring the directory exists
 */
export function saveJsonToFile(fileName: string, data: unknown): void {
	const dir = path.dirname(fileName);
	fs.mkdirSync(dir, { recursive: true });
	fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
}
