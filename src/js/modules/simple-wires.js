class SimpleWires {
	static load(bomb) {
		// Load bomb settings
		this.bomb = bomb;

		// Load View
		const content = `<div class="d-flex flex-row justify-content-center mb-4">
        <button
            type="button"
            class="wire-count btn btn-warning w-100 m-1"
        >
            3
        </button>
        <button
            type="button"
            class="wire-count btn btn-warning w-100 m-1"
        >
            4
        </button>
        <button
            type="button"
            class="wire-count btn btn-warning w-100 m-1"
        >
            5
        </button>
        <button
            type="button"
            class="wire-count btn btn-warning w-100 m-1"
        >
            6
        </button>
    </div>
    <table class="table table-dark table-bordered">
        <thead>
            <tr class="d-flex text-center">
                <th class="col-2" scope="col">Wire No#</th>
                <th class="col-8" scope="col">Wire Color</th>
                <th class="col-2" scope="col">Cut?</th>
            </tr>
        </thead>
        <tbody id="wires-row">

        </tbody>
    </table>`;
		const module_content = document.querySelector('#module-content');
		module_content.innerHTML = content;

		// Event: Wire Count
		[...document.querySelectorAll('.wire-count')].forEach((wire) => {
			wire.addEventListener('click', (e) => {
				this.wireCount = e.target.innerText;
				SimpleWires.viewTable();
			});
		});
	}

	static viewTable() {
		// Reset Table
		const tbody = document.querySelector('#wires-row');
		tbody.innerHTML = '';

		// Add Wires Row to Table
		for (let i = 1; i <= Number(this.wireCount); i++) {
			const wire_row = document.createElement('tr');
			wire_row.className =
				'd-flex justify-content-center align-items-center text-center';
			wire_row.innerHTML = `            
            <td class="col-2">${i}</td>
            <td class="wire-color col-8 d-flex">
                <button
                    type="button"
                    class="red-wire wire btn w-100 m-1"
                    style="background: red;"
                >
                    Red
                </button>
                <button
                    type="button"
                    class="white-wire wire btn w-100 m-1"
                    style="background: white; color: black;"
                >
                    White
                </button>
                <button
                    type="button"
                    class="blue-wire wire btn w-100 m-1"
                    style="background: rgb(65, 65, 251);"
                >
                    Blue
                </button>
                <button
                    type="button"
                    class="yellow-wire wire btn w-100 m-1"
                    style="background: yellow; color: black;"
                >
                    Yellow
                </button>
                <button
                    type="button"
                    class="black-wire wire btn w-100 m-1"
                    style="background: black;"
                >
                    Black
                </button>
            </td>
            <td class="wire-cut col-2"></td>`;
			tbody.appendChild(wire_row);
		}

		// Event: Wire Color clicked | try Solve()
		let wires = [...document.querySelectorAll('.wire')];
		wires.forEach((wire) => {
			wire.addEventListener('click', (e) => {
				// Get selected Wire
				const choosenWire = e.target;

				// Delete siblings wire
				const parentElement = e.target.parentElement;
				parentElement.innerHTML = '';
				parentElement.appendChild(choosenWire);

				// Solve Wires
				SimpleWires.solve();
			});
		});
	}

	static solve() {
		let wires = [...document.querySelectorAll('.wire')];

		const bombSettings = this.bomb;

		// Solve
		if (wires.length <= 6) {
			// Get Wire Color
			let wire_colors = wires.map((wire) => wire.classList.item(0));

			// Answer 1-based
			// Ex. 3 wires -> 1 2 3
			let answer = 0;

			// [color]-wire -> red,white,blue,yellow,black
			switch (wires.length) {
				case 3:
					// If there are no red wires, cut the second wire.
					if (!wire_colors.find((wire) => wire === 'red-wire')) {
						answer = 2;
					}
					// Otherwise, if the last wire is white, cut the last wire.
					else if (wire_colors[2] === 'white-wire') {
						answer = 3;
					}
					// Otherwise, if there is more than one blue wire, cut the last  blue wire.
					else if (
						wire_colors.filter((wire) => wire === 'blue-wire').length > 1
					) {
						answer = wire_colors[2] === 'blue-wire' ? 3 : 2;
					}
					// Otherwise, cut the last wire
					else {
						answer = 3;
					}
					break;

				case 4:
					// If there is more than one red wire and the last digit of the serial number is odd, cut the last red wire.
					if (
						wire_colors.filter((wire) => wire === 'red-wire').length > 1 &&
						bombSettings.serial[bombSettings.serial.length - 1] % 2 === 1
					) {
						for (let i = wire_colors.length - 1; i >= 0; i--) {
							if (wire_colors[i] === 'red-wire') {
								answer = i + 1;
								break;
							}
						}
					}
					// Otherwise, if the last wire is yellow and there are no red wires, cut the first wire.
					else if (
						wire_colors[3] === 'yellow-wire' &&
						!wire_colors.find((wire) => wire === 'red-wire')
					) {
						answer = 1;
					}
					// Otherwise, if there is exactly one blue wire, cut the first wire.
					else if (
						wire_colors.filter((wire) => wire === 'blue-wire').length === 1
					) {
						answer = 1;
					}
					// Otherwise, if there is more than one yellow wire, cut the last wire.
					else if (
						wire_colors.filter((wire) => wire === 'yellow-wire').length > 1
					) {
						answer = 4;
					}
					// Otherwise, cut the second wire.
					else {
						answer = 2;
					}
					break;

				case 5:
					// If the last wire is black and the last digit of the serial number is odd, cut the fourth wire.
					if (
						wire_colors[4] === 'black-wire' &&
						bombSettings.serial[bombSettings.serial.length - 1] % 2 === 1
					) {
						answer = 4;
					}
					// Otherwise, if there is exactly one red wire and there is more than one yellow wire, cut the first wire.
					else if (
						wire_colors.filter((wire) => wire === 'red-wire').length === 1 &&
						wire_colors.filter((wire) => wire === 'yellow-wire').length > 1
					) {
						answer = 1;
					}
					// Otherwise, if there are no black wires, cut the second wire.
					else if (
						wire_colors.filter((wire) => wire === 'black-wire').length === 0
					) {
						answer = 2;
					}
					// Otherwise, cut the first wire.
					else {
						answer = 1;
					}
					break;
				case 6:
					// If there are no yellow wires and the last digit of the serial number is odd, cut the third wire.
					if (
						wire_colors.filter((wire) => wire === 'yellow-wire').length === 0 &&
						bombSettings.serial[bombSettings.serial.length - 1] % 2 === 1
					) {
						answer = 3;
					}
					// Otherwise, if there is exactly one yellow wire and there is more than one white wire, cut the fourth wire.
					else if (
						wire_colors.filter((wire) => wire === 'yellow-wire').length === 1 &&
						wire_colors.filter((wire) => wire === 'white-wire').length > 1
					) {
						answer = 4;
					}
					// Otherwise, if there are no red wires, cut the last wire.
					else if (
						wire_colors.filter((wire) => wire === 'red-wire').length === 0
					) {
						answer = 6;
					}
					// Otherwise, cut the fourth wire.
					else {
						answer = 4;
					}
					break;
			}

			// console.log('ANSWER' + answer);
			let cut_status = [...document.querySelectorAll('.wire-cut')];
			cut_status[
				answer - 1
			].innerHTML = `<div class="bg-danger" style="font-size: 20px; color: white">CUT</div>`;
		}
	}
}

export default SimpleWires;
