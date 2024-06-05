chrome.runtime.sendMessage('I am loading content script', (response) => {
	// console.log(response);
	// console.log('I am content script');
});

window.onload = (event) => {};

// listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request === 'read_table') {
		// read the table
		const table = document.querySelector('.tlant-table-content table');

		// Check if table tr th Google Maps Route exists
		const headerRow = table.querySelector('thead tr');
		const header = headerRow.getElementsByTagName('th')[8];
		// console.log(header, 'header');
		if (header.textContent === 'Google Maps Route') {
			sendResponse('Google Maps Route already exists');
			return;
		}
		// Add a new column header
		const newHeader = document.createElement('th');
		newHeader.className = 'tlant-table-cell tlant-table-cell-ellipsis';
		newHeader.textContent = 'Google Maps Route';
		headerRow.appendChild(newHeader);

		// Add a new cell with Google Maps link to each row at 8th column (index 7) header row
		const existingCell = headerRow.getElementsByTagName('th')[7];
		existingCell.parentNode.insertBefore(newHeader, existingCell.nextSibling);

		// Add a new cell with Google Maps link to each row
		const rows = table.querySelectorAll('tbody a');

		for (let i = 0; i < rows.length; i++) {
			const row: any = rows[i];
			const source = row
				.querySelector('td:nth-child(2) .index-module-loadLocation-pmPrI')
				.textContent.trim();
			const destination = row
				.querySelector('td:nth-child(5) .index-module-loadLocation-pmPrI')
				.textContent.trim();

			const existingRowCell = row.getElementsByTagName('td')[7];

			const newCell = document.createElement('td');
			newCell.className = 'tlant-table-cell tlant-table-cell-ellipsisr';
			const newDiv = document.createElement('div');

			newDiv.addEventListener('click', (e) => {
				e.stopPropagation();
				e.preventDefault();
				addIframe(source, destination);
			});
			newDiv.style.zIndex = '9999';
			newDiv.style.cursor = 'pointer';
			newDiv.style.fontWeight = '600';
			newDiv.style.fontSize = '14rem';
			newDiv.style.lineHeight = '19rem';
			newDiv.style.color = '#4066d4';
			newDiv.textContent = 'View Route';

			newCell.appendChild(newDiv);
			existingRowCell.parentNode.insertBefore(
				newCell,
				existingRowCell.nextSibling
			);
		}
	}
});

function addIframe(source: any, destination: any) {
	const url = createGoogleMapsIframe(source, destination);
	const warp = document.body.querySelector('.index-module-warp-YwZb-');
	// add a new div to the warp first child
	const newDiv = document.createElement('div');
	newDiv.className = 'close child';
	newDiv.style.zIndex = '9998';
	newDiv.style.cursor = 'pointer';
	newDiv.style.color = '#4066d4';

	// check if the iframe already exists googleMapsIframe
	let iframeOld = document.getElementById('googleMapsIframe');

	if (iframeOld) {
		iframeOld.remove();
	}
	// create iframe element
	const iframe = document.createElement('iframe');

	iframe.frameBorder = '0';
	iframe.width = '100%';
	iframe.height = '200';
	iframe.id = 'googleMapsIframe';
	iframe.setAttribute('src', url);
	iframe.style.zIndex = '9997';
	iframe.style.backgroundColor = 'white';

	// add the iframe to the warp
	newDiv.appendChild(iframe);

	//find the second child of the warp
	const childFirst = warp.children[2];
	warp.insertBefore(newDiv, childFirst);
}

function createGoogleMapsLink(origin: any, destination: any) {
	return `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
		origin
	)}&destination=${encodeURIComponent(destination)}`;
}

function createGoogleMapsIframe(origin: any, destination: any) {
	return `https://www.google.com/maps/embed/v1/directions?key=API_KEY&origin=${encodeURIComponent(
		origin
	)}&destination=${encodeURIComponent(destination)}`;
}

function openInNewTab(url: any) {
	var win = window.open(url, '_blank');
	win.focus();
}
