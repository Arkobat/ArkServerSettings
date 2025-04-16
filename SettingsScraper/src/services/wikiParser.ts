import * as cheerio from "cheerio";
import { ArkGame, ConfigFile, TableRow } from "../types/index.js";

export class WikiParser {
	private readonly wikiUrl = "https://ark.wiki.gg/wiki/Server_configuration";
	private readonly targetTexts = ["GameUserSettings.ini", "Game.ini"];
	private $: cheerio.Root | null = null;

	/**
	 * Fetch and load the wiki HTML
	 */
	async load(): Promise<void> {
		const response = await fetch(this.wikiUrl);
		const html = await response.text();
		this.$ = cheerio.load(html);
	}

	/**
	 * Parse the wiki and extract configuration data
	 */
	async parseWiki(gameType: ArkGame): Promise<ConfigFile[]> {
		if (!this.$) {
			await this.load();
		}

		const $ = this.$!;
		const data: ConfigFile[] = [];

		$("h3")
			.filter((i, el) => {
				const text = $(el).text().trim();
				return this.targetTexts.includes(text);
			})
			.slice(0, 2)
			.each((i, el) => {
				const filename = $(el).text().trim();
				const headers = $(el).nextAll("h4");

				const file: ConfigFile = {
					filename,
					headers: [],
				};

				// Special case for Game.ini - it has a table without an h4 header
				if (filename === "Game.ini") {
					file.headers.push({
						header: "[/script/shootergame.shootergamemode]",
						table: this.parseTable(
							$(el).nextAll(".widetable").find("table").first(),
							gameType
						),
					});
				}

				// Process tables with h4 headers
				for (const header of headers) {
					const tableDiv = $(header)
						.nextAll(".widetable")
						.find("table")
						.first();
					if (tableDiv.length > 0) {
						const table = this.parseTable(tableDiv, gameType);
						file.headers.push({
							header: $(header).text(),
							table,
						});
					}
				}

				data.push(file);
			});

		return data;
	}

	/**
	 * Parse a table element into structured data
	 */
	private parseTable(tableElement: any, gameType: ArkGame): TableRow[] {
		if (!this.$) {
			throw new Error("Wiki not loaded");
		}

		const $ = this.$;
		const headers: string[] = [];
		const tableData: TableRow[] = [];

		// Extract headers from the first row
		tableElement.find("tr:first-child th").each((i: number, th: any) => {
			let headerText = $(th).text().trim().replace(/\s+/g, " ");

			// Standardize specific headers based on content/structure
			if ($(th).find('a[title="ARK: Survival Ascended"]').length > 0) {
				headerText = ArkGame.ASA;
			} else if ($(th).find('a[title="ARK: Survival Evolved"]').length > 0) {
				headerText = ArkGame.ASE;
			} else if (
				$(th).find('span.hover-text[title*="command line"]').length > 0
			) {
				headerText = "CMD";
			} else {
				headerText = headerText.replace(/\n/g, " ").replace(/ +/g, " ").trim();
			}

			headers.push(headerText);
		});

		// Process data rows
		tableElement
			.find("tr")
			.slice(1)
			.each((rowIndex: number, rowElement: any) => {
				const row = $(rowElement);

				// Skip separator rows or deprecated rows
				if (
					row.find("th[colspan]").length > 0 ||
					row.hasClass("redish-background")
				) {
					return;
				}

				const cells = row.find("td");

				// Ensure row has the expected number of cells
				if (cells.length !== headers.length) {
					return;
				}

				const rowData: TableRow = { Variable: "" };

				cells.each((cellIndex: number, cellElement: any) => {
					const header = headers[cellIndex];
					if (!header) return;

					const cell = $(cellElement);
					let cellValue: any;

					const img = cell.find("img").first();

					// Handle image-based cells (ASA, ASE, CMD)
					if (["ASA", "ASE", "CMD"].includes(header) && img.length > 0) {
						const altText = img.attr("alt") || "";
						if (altText.includes("Check mark")) {
							cellValue = true;
						} else if (altText.includes("X mark")) {
							cellValue = false;
						} else if (altText.includes("Missing")) {
							cellValue = null;
						} else {
							cellValue = cell.text().trim();
						}
					}
					// Handle 'Variable' cell with <code> tag
					else if (header === "Variable") {
						const code = cell.find("code").first();
						cellValue = (code.length > 0 ? code.text() : cell.text()).trim();
					}
					// General text extraction for other cells
					else {
						cellValue =
							cell
								.html()
								?.replace(/<br\s*\/?>/gi, "\n")
								.replace(/<[^>]*>/g, "")
								.replace(/&#160;/g, " ")
								.trim() || "";
					}

					// Extract value type and default value from <i> tags in Description
					if (header === "Description") {
						cell.find("i").each((i: number, el: any) => {
							if ($(el).text().trim().includes("Value type:")) {
								rowData.ValueType = $(el)
									.text()
									.trim()
									.replace("Value type:", "")
									.trim();
							}

							if ($(el).text().trim().includes("Default value:")) {
								rowData.DefaultValue = $(el).find("code").text().trim();
							}
						});
					}

					rowData[header] = cellValue;
				});

				// Only include rows relevant to the selected game
				if (
					(gameType === ArkGame.ASA && rowData.ASA === false) ||
					(gameType === ArkGame.ASE && rowData.ASE === false)
				) {
					return;
				}

				tableData.push(rowData);
			});

		return tableData;
	}
}
