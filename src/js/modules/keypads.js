import test from '../../images/symbols/ae.png';

class Keypads {
	static importAllImage() {
		const requireContext = require.context(
			'../../images/symbols/',
			false,
			/\.(png|jpe?g|svg)$/
		);

		const imagesCollection = requireContext.keys().map(requireContext);

		return imagesCollection;
	}

	static findInArray(arr, subarr) {
		let exists = true;

		subarr.forEach((subel) => {
			if (!arr.includes(parseInt(subel))) {
				exists = false;
			}
		});

		return exists;
	}

	/*
		--KEYPAD--
		0. ae
		1. at
		2. balloon
		3. bt
		4. copyright
		5. cursive
		6. doublek
		7. dragon
		8. euro
		9. filledstar
		10. hollowstar
		11. hookn
		12. leftc
		13. meltedthree
		14. nwithhat
		15. omega
		16. paragraph
		17. pitchfork
		18. pumpkin
		19. questionmark
		20. rightc
		21. six
		22. smileyface
		23. squidknife
		24. squigglyn
		25. tracks
		26. upsidedowny
		*/

	static load(bomb) {
		this.bomb = bomb;
		this.count = 0;
		this.chosen = new Map();
		this.correctSequence = [
			[2, 1, 26, 24, 23, 11, 12],
			[8, 2, 12, 5, 10, 11, 19],
			[4, 18, 5, 6, 13, 26, 10],
			[21, 16, 3, 23, 6, 19, 22],
			[17, 22, 3, 20, 16, 7, 9],
			[21, 8, 25, 0, 17, 14, 15],
		];
		this.currentSequence = this.correctSequence.slice();

		const imagesCollection = Keypads.importAllImage();

		// Load View
		const content = `
        <div id="keypad-chosen">
            <div id="chosen-1" class="chosen bg-dark d-flex justify-content-center align-items-center"></div>
            <div id="chosen-2" class="chosen bg-dark d-flex justify-content-center align-items-center"></div>
            <div id="chosen-3" class="chosen bg-dark d-flex justify-content-center align-items-center"></div>
            <div id="chosen-4" class="chosen bg-dark d-flex justify-content-center align-items-center"></div>
        </div>
        <div id="keypad-collection" class="mb-4 p-3">
        </div>`;

		const module_content = document.querySelector('#module-content');
		module_content.innerHTML = content;

		// Image
		imagesCollection.forEach((image, index) => {
			const keypad = document.createElement('div');
			keypad.id = `select-${index}`;
			keypad.dataset.id = index;
			keypad.className = 'keypad bg-light';
			keypad.style.backgroundImage = `url('${image.default}')`;
			keypad.style.backgroundRepeat = 'no-repeat';
			keypad.style.backgroundPosition = 'center center';

			document.querySelector('#keypad-collection').appendChild(keypad);
		});

		[...document.querySelectorAll('.keypad')].forEach((keypad) => {
			keypad.addEventListener('click', (e) => {
				// Add Chosen Keypad

				if (!e.target.classList.contains('lock-button') && this.count < 4)
					Keypads.addKeypad(e.target);
			});
		});

		[...document.querySelectorAll('.chosen')].forEach((keypad) => {
			keypad.addEventListener('click', (e) => {
				// Remove Chosen Keypad
				if (e.target.tagName === 'IMG') {
					Keypads.removeKeypad(e.target.parentNode);
				} else {
					Keypads.removeKeypad(e.target);
				}
			});
		});
	}

	static addKeypad(chosenKeypad) {
		// increase count
		this.count++;

		const filename = chosenKeypad.style.backgroundImage.match(
			/url\("(.*)"\)/
		)[1];

		this.chosen.set(chosenKeypad.getAttribute('data-id'), filename);

		Keypads.refreshButton();
	}

	static removeKeypad(chosenKeypad) {
		// decrease count
		this.count--;

		this.chosen.delete(chosenKeypad.getAttribute('data-id'));

		Keypads.refreshButton();
	}

	static refreshButton() {
		// Lock all button
		this.currentSequence.forEach((sequence) => {
			// Lock all button
			sequence.forEach((el) => {
				document.querySelector(`#select-${el}`).classList.add('lock-button');
			});
		});

		// Remove lock if available
		this.currentSequence.forEach((sequence) => {
			let flag = Keypads.findInArray(sequence, [...this.chosen.keys()]);

			// Remove lock
			if (flag) {
				sequence.forEach((el) => {
					document
						.querySelector(`#select-${el}`)
						.classList.remove('lock-button');
				});
			}
		});

		// Solve
		Keypads.solve();
	}

	static solve() {
		// Reset 4 Chosen button
		const allChosen = document.querySelectorAll(`.chosen`);
		[...allChosen].forEach((chosen) => {
			chosen.dataset.id = '-1';
			chosen.innerHTML = '';
		});

		// Find the only sequence possible
		let availableSequence = [];
		this.currentSequence.forEach((sequence) => {
			let flag = Keypads.findInArray(sequence, [...this.chosen.keys()]);
			// Add to array if on sequence
			if (flag) {
				availableSequence.push(sequence);
			}
		});

		let count = 1;
		let chosenCollection = [...this.chosen.keys()];
		let chosenIndexCollection = [];
		// Solve sort if only 1 sequence available
		if (availableSequence.length === 1) {
			chosenCollection.forEach((chosen) => {
				chosenIndexCollection.push(
					availableSequence[0].indexOf(parseInt(chosen))
				);
			});

			// Bubble Sort index
			for (let i = 0; i < chosenIndexCollection.length - 1; i++) {
				for (let j = i + 1; j < chosenIndexCollection.length; j++) {
					if (chosenIndexCollection[i] > chosenIndexCollection[j]) {
						let temp1 = chosenIndexCollection[i];
						chosenIndexCollection[i] = chosenIndexCollection[j];
						chosenIndexCollection[j] = temp1;

						let temp2 = chosenCollection[i];
						chosenCollection[i] = chosenCollection[j];
						chosenCollection[j] = temp2;
					}
				}
			}

			// Re-render
			chosenCollection.forEach((keys) => {
				const chosen = document.querySelector(`#chosen-${count}`);
				chosen.dataset.id = keys;
				const chosenImage = new Image();
				chosenImage.src = this.chosen.get(keys);
				chosenImage.alt = 'chosen-image';
				chosen.appendChild(chosenImage);

				count++;
			});
		} else {
			// Re-render image
			for (let [keys, values] of this.chosen) {
				const chosen = document.querySelector(`#chosen-${count}`);
				chosen.dataset.id = keys;
				const chosenImage = new Image();
				chosenImage.src = values;
				chosenImage.alt = 'chosen-image';
				chosen.appendChild(chosenImage);

				count++;
			}
		}
	}
}

export default Keypads;
