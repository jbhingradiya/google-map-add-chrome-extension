import React from 'react';
import './popup.css';

const Popup = () => {
	const readTable = () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, 'read_table', (response) => {
				console.log(response);
			});
		});
	};
	return (
		<div className="py-4 px-4 bg-gray-100  flex justify-center h-full w-full">
			{/* <h1 className="text-4xl text-green-500">Hello World</h1> */}

			<button
				onClick={readTable}
				className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
				Add Google Maps Route
			</button>
		</div>
	);
};

export default Popup;
