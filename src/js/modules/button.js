class Button {
	static load(bomb) {
		// Load bomb settings
		this.bomb = bomb;
		this.buttonLabel = null;
		this.buttonColor = null;
		this.carStatus = false;
		this.frkStatus = false;

		// Load View
		const content = `
    <table class="table table-dark table-bordered">
        <thead>
            <tr class="d-flex text-center">
                <th class="col-3" scope="col">Name</th>
                <th class="col-9" scope="col">Settings</th>
            </tr>
        </thead>
        <tbody>
            <tr class="d-flex justify-content-center align-items-center text-center">
                <td class="col-3" scope="col">Label</td>
                <td class="col-9" scope="col">
                    <div class="d-flex flex-row justify-content-center">
                        <button
                            type="button"
                            class="button-label btn bg-light w-100 m-1"
                            data-label="abort"
                        >
                            Abort
                        </button>
                        <button
                            type="button"
                            class="button-label btn bg-light w-100 m-1"
                            data-label="detonate"
                        >
                            Detonate
                        </button>
                        <button
                            type="button"
                            class="button-label btn bg-light w-100 m-1"
                            data-label="hold"
                        >
                            Hold
                        </button>
                        <button
                            type="button"
                            class="button-label btn bg-light w-100 m-1"
                            data-label="press"
                        >
                            Press
                        </button>
                    </div>
                </td>
            </tr>

            <tr class="d-flex justify-content-center align-items-center text-center">
                <td class="col-3" scope="col">Color</td>
                <td class="col-9" scope="col">
                    <div class="d-flex flex-row justify-content-center">
                        <button
                            type="button"
                            class="button-color btn w-100 m-1"
                            style="background: red;"
                            data-color="red"
                        >
                            Red
                        </button>
                        <button
                            type="button"
                            class="button-color btn w-100 m-1"
                            style="background: white; color: black;"
                            data-color="white"
                        >
                            White
                        </button>
                        <button
                            type="button"
                            class="button-color btn w-100 m-1"
                            style="background: rgb(65, 65, 251);"
                            data-color="blue"
                        >
                            Blue
                        </button>
                        <button
                            type="button"
                            class="button-color btn w-100 m-1"
                            style="background: yellow; color: black;"
                            data-color="yellow"
                        >
                            Yellow
                        </button>
                        <button
                            type="button"
                            class="button-color btn w-100 m-1"
                            style="background: black;"
                            data-color="black"
                        >
                            Black
                        </button>
                    </div>
                </td>
            </tr>

            <tr class="d-flex justify-content-center align-items-center text-center">
                <td class="col-3" scope="col">Indicator</td>
                <td class="col-9" scope="col">
                    <div class="d-flex flex-row justify-content-center">
                        <button
                            type="button"
                            class="button-indicator btn w-100 m-1"
                            id="button-car"
                        >
                            CAR Not Present
                        </button>
                        <button
                            type="button"
                            class="button-indicator btn w-100 m-1"
                            id="button-frk"
                        >
                            FRK Not Present
                        </button>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
    <br>
    <div id="answer" class="d-flex justify-content-center align-items-center text-center">
    
    </div>`;
		const module_content = document.querySelector('#module-content');
		module_content.innerHTML = content;

		// Event: Button Label
		[...document.querySelectorAll('.button-label')].forEach((label) => {
			label.addEventListener('click', (e) => {
				this.buttonLabel = e.target.getAttribute('data-label');

				const parentElement = e.target.parentElement;
				parentElement.innerHTML = '';
				parentElement.appendChild(e.target);

				Button.solve();
			});
		});

		// Event: Button Color
		[...document.querySelectorAll('.button-color')].forEach((color) => {
			color.addEventListener('click', (e) => {
				this.buttonColor = e.target.getAttribute('data-color');

				const parentElement = e.target.parentElement;
				parentElement.innerHTML = '';
				parentElement.appendChild(e.target);

				Button.solve();
			});
		});

		// Event: Button Indicator CAR
		document.querySelector('#button-car').addEventListener('click', (e) => {
			this.carStatus = !this.carStatus;
			e.target.classList.toggle('bg-light');

			if (this.carStatus) {
				e.target.textContent = 'CAR Present';
			} else {
				e.target.textContent = 'CAR Not Present';
			}

			Button.solve();
		});

		// Event: Button Indicator FRK
		document.querySelector('#button-frk').addEventListener('click', (e) => {
			this.frkStatus = !this.frkStatus;
			e.target.classList.toggle('bg-light');

			if (this.frkStatus) {
				e.target.textContent = 'FRK Present';
			} else {
				e.target.textContent = 'FRK Not Present';
			}

			Button.solve();
		});
	}

	static solve() {
		const holdButton = `
        <div class="w-100 bg-dark p-3 drop-animation">
            <h3>ANSWER</h3>
            <h4>Releasing a Held Button</h4>
            <div class="d-flex flex-row justify-content-center">
                <div class="row w-100">
                    <div class="col-12 p-2" style="background: blue;">Blue Strip: 4 in any position</div>
                    <div class="col-12 p-2" style="background: yellow; color:black;">Yellow Strip: 5 in any position</div>
                    <div class="col-12 p-2 bg-light">Other Strip: 1 in any position</div>
                </div>
            </div>
        </div>`;

		const clickButton = `
        <div class="w-100 bg-dark p-3 drop-animation">
            <h3>ANSWER</h3>
            <h4>Press and Immediately Release the Button</h4>
        </div>`;

		const answerDOM = document.querySelector('#answer');

		// if (this.buttonColor === 'blue' && this.buttonLabel === 'abort') {
		// 	answerDOM.innerHTML = holdButton;
		// } else if (this.bomb.battery > 1 && this.buttonLabel === 'detonate') {
		// 	answerDOM.innerHTML = clickButton;
		// } else if (this.buttonColor === 'white' && this.carStatus === true) {
		// 	answerDOM.innerHTML = holdButton;
		// } else if (this.bomb.battery > 2 && this.frkStatus === true) {
		// 	answerDOM.innerHTML = clickButton;
		// } else if (this.buttonColor === 'yellow') {
		// 	answerDOM.innerHTML = holdButton;
		// } else if (this.buttonColor === 'red' && this.buttonLabel === 'hold') {
		// 	answerDOM.innerHTML = clickButton;
		// } else {
		// 	answerDOM.innerHTML = holdButton;
		// }

		if (
			(this.bomb.battery > 1 && this.buttonLabel === 'detonate') ||
			(this.bomb.battery > 2 && this.frkStatus === true) ||
			(this.buttonColor === 'red' && this.buttonLabel === 'hold')
		) {
			answerDOM.innerHTML = clickButton;
		} else {
			answerDOM.innerHTML = holdButton;
		}
	}
}

export default Button;
