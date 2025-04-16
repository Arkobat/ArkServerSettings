# ARK Server Settings

This repository contains a collection of server setting templates for configuring ARK servers. The templates cover different ARK variants, such as *Survival Evolved* and *Survival Ascended*, providing ready-to-use configurations for common server settings. Additionally, a scraper is included to extract all settings from the ARK wiki, written in JavaScript, to help you stay updated with the latest available configurations.

## Folder Structure

The repository is structured as follows:

```
ARK Server Settings/
├── SurvivalEvolved/
│   ├── Default/
│   │   ├── Game.ini
│   │   ├── GameUserSettings.ini
│   │   └── README.md
│   ├── Template1/
│   │   ├── Game.ini
│   │   ├── GameUserSettings.ini
│   │   └── README.md
│   ├── Template2/
│   │   ├── Game.ini
│   │   ├── GameUserSettings.ini
│   │   └── README.md
├── SurvivalAscended/
│   ├── Default/
│   │   ├── Game.ini
│   │   ├── GameUserSettings.ini
│   │   └── README.md
│   ├── Template1/
│   │   ├── Game.ini
│   │   ├── GameUserSettings.ini
│   │   └── README.md
│   ├── Template2/
│   │   ├── Game.ini
│   │   ├── GameUserSettings.ini
│   │   └── README.md
├── SettingsScraper/
│   └── <scraper files>
```

### SurvivalEvolved/ and SurvivalAscended/

These directories contain templates for the corresponding ARK game variants. Each template folder includes:

- Game.ini: The main server configuration file.
- GameUserSettings.ini: User-specific server settings.
- README.md: Template-specific instructions and details.

### SettingsScraper/

The scraper folder contains JavaScript files that help you fetch all server settings directly from the ARK wiki. This ensures you always have the latest information.

## How to Use

1. **Choose a Template**: Navigate to the folder for either *Survival Evolved* or *Survival Ascended* based on the version of ARK you are configuring.
2. **Select a Template**: Inside the game variant folder, choose a template (`Default`, `Template1`, `Template2`, etc.).
3. **Customize Settings**: Modify the `Game.ini` and `GameUserSettings.ini` files as needed for your server.
4. **Run the Scraper**: If you want to pull the latest settings from the wiki, use the scraper in the `SettingScraper/` folder. You can run the scraper via Node.js to update your server configurations with the latest settings.

## Contributing

Feel free to fork this repository, submit issues, or open pull requests with improvements or additional templates. If you have specific server settings that you think could be useful for others, don't hesitate to share!

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
