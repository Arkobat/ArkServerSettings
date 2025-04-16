#!/usr/bin/env node

import { Command, Option } from "commander";
import path from "path";
import { ArkGame } from "./types/index.js";
import { WikiParser } from "./services/wikiParser.js";
import {
	saveToFile,
	saveJsonToFile,
	generateConfigContent,
} from "./utils/fileUtils.js";

const program = new Command();

program
	.description("ARK Server Configuration Generator")
	.addOption(
		new Option("-g, --game <value>", "Which ARK game to target (ASA or ASE)")
			.choices(Object.values(ArkGame))
			.makeOptionMandatory(true)
		//		.default(ArkGame.ASA)
	)
	.option("-o, --output <directory>", "Output directory for config files", "./")
	.option("-j, --json", "Also output JSON data files", false)
	.version("1.0.0");

program.parse();

const options = program.opts();

async function main() {
	try {
		console.log(`Fetching server configuration data for ${options.game}...`);
		const wikiParser = new WikiParser();
		await wikiParser.load();
		const data = await wikiParser.parseWiki(options.game as ArkGame);

		console.log("Data successfully parsed!");

		if (options.json) {
			console.log("Saving JSON data...");
			saveJsonToFile(`${options.output}/ark-config-data.json`, data);
		}

		console.log("Generating config files...");
		for (const file of data) {
			const content = generateConfigContent(file);

			const filePath = path.join(options.output, file.filename);
			saveToFile(filePath, content);
			console.log(`Created ${filePath}`);
		}

		console.log("Done!");
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
}

main();
