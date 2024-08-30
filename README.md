# Playwright TypeScript Framework

This is a TypeScript-based testing framework using Playwright. The framework is set up to facilitate end-to-end testing for web applications.

## Project Structure

- `package.json`: Contains metadata about the project and lists the dependencies.
- `package-lock.json`: Records the exact versions of the dependencies installed.
- `node_modules/`: Directory where all the project dependencies are installed.

## Dependencies

### Dev Dependencies

- **@playwright/test**: Playwright's test runner and assertion library.
- **@types/node**: TypeScript definitions for Node.js.

## Installation

To install the dependencies, run:


```zsh
brew install node
```

```zsh
npm install
```

```zsh
npm init playwright
```

## Running Tests

To run the tests, execute the following command:

```zsh
npx playwright test
```

## Writing Tests

The tests are written in TypeScript and are located in the `tests/` directory. The test files have the `.spec.ts` extension.

## Configuration

The configuration for the Playwright test runner is located in the `playwright.config.ts` file.

## Reporting

The test results are displayed in the terminal. You can also generate a report in HTML format by running the following command:

```zsh
npx playwright test --reporter=list
```

The report will be saved in the `test-results/` directory.

## CI/CD

The project is set up to run on GitHub Actions. The workflow configuration is located in the `.github/workflows/` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.