import chromium from 'chrome-aws-lambda';
import pw from 'playwright-core';

const generatePdf = async (html = '') => {
	const options = process.env.AWS_REGION
		? {
				args: chromium.args,
				executablePath: await chromium.executablePath,
				headless: chromium.headless,
		  }
		: {
				args: [],
				executablePath:
					process.platform === 'win32'
						? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
						: process.platform === 'linux'
						? '/usr/bin/google-chrome'
						: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
		  };

	const browser = await pw.chromium.launch(options);
	const page = await browser.newPage();

	await page.setContent(html);

	const pdfBuffer = await page.pdf({
		format: 'letter',
		pageRanges: '1',
	});

	await page.close();
	await browser.close();

	return pdfBuffer;
};

export const get = async (event) => {
		const pdf = await generatePdf(`<html><body>Hello World</body></html>`);

		return {
			headers: {
				'Content-Type': 'application/pdf',
			},
			body: pdf,
		};
}