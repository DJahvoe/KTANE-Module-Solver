// Import Assets
import './css/custom.css';
import './css/all.min.css';
import './css/bootstrap.min.css';

import './js/all.min.js';
import Banner from './images/banner.png';

// Import Modules
import SimpleWires from './js/modules/simple-wires.js';
import Button from './js/modules/button.js';
import Keypads from './js/modules/keypads.js';

const DOMCollection = {
	bomb_settings: document.querySelector('#bomb-settings'),
	serial: document.querySelector('#serial'),
	battery: document.querySelector('#battery'),
	parallel_port: document.querySelector('#parallel-port'),
	validation: document.querySelector('#validation'),
	sidebar: document.querySelector('#sidebar-wrapper'),
	main: document.querySelector('#main'),
	module_part: document.querySelector('#module-part'),
	module_items: [...document.querySelectorAll('.module-item')],
};

let ModuleList = new Map();

class Bomb {
	constructor(serial = '', battery = '', parallel_port = '') {
		this.serial = serial;
		this.battery = battery;
		this.parallel_port = parallel_port;
	}
}

class UI {
	static displaySolverStatus(message, status) {
		const validationDOM = DOMCollection.validation;
		if (validationDOM.childNodes[0] !== undefined) {
			validationDOM.removeChild(validationDOM.childNodes[0]);
		}
		const statusNode = document.createElement('div');

		const color = status === 'lock' ? 'danger' : 'success';

		statusNode.classList = `col-md-10 bg-${color} p-3`;
		statusNode.innerHTML = `<i class="fas fa-${status}"></i> ${message}`;

		validationDOM.appendChild(statusNode);
	}

	static displaySidebar(state) {
		if (state) {
			DOMCollection.sidebar.classList.add('sidebar-show');
			DOMCollection.sidebar.classList.remove('sidebar-hide');

			DOMCollection.main.classList.add('main-slide');
			DOMCollection.main.classList.remove('main-normal');
		} else {
			DOMCollection.sidebar.classList.remove('sidebar-show');
			DOMCollection.sidebar.classList.add('sidebar-hide');

			DOMCollection.main.classList.remove('main-slide');
			DOMCollection.main.classList.add('main-normal');
		}
	}
}

class Logic {
	static bombSettingsValidation(bomb) {
		const serialVal = DOMCollection.serial.value;
		const batteryVal = DOMCollection.battery.value;
		const parallelPortVal = DOMCollection.parallel_port.value;

		if (serialVal === '' || batteryVal === '' || parallelPortVal === '') {
			return false;
		} else {
			bomb.serial = serialVal;
			bomb.battery = batteryVal;
			bomb.parallel_port = parallelPortVal;
			return true;
		}
	}
}

class Module {
	static loadModule(bomb, module) {
		// Reset initial module
		Module.resetModule();

		// Load Module Header
		const module_header = `					
        <hr />
        <h3 class="text-center bg-primary p-3 mt-4 mb-4">
            ${module.innerText}
        </h3>
		<div id="module-content">
			
        </div>
        `;
		DOMCollection.module_part.innerHTML = module_header;

		// Get Module View
		ModuleList.get(module.id).load(bomb);
	}

	static resetModule() {
		const moduleDOM = DOMCollection.module_part;

		// Remove all child
		moduleDOM.innerHTML = '';
	}

	static loadModulesSettings() {
		// Load all modules
		ModuleList.set('simple-wires', SimpleWires);
		ModuleList.set('button', Button);
		ModuleList.set('keypads', Keypads);
	}
}

class Component {
	static loadBanner() {
		// Load Banner and add image into banner
		const bannerDiv = document.querySelector('#banner');
		const KTANEBanner = new Image();
		KTANEBanner.src = Banner;
		KTANEBanner.width = 400;
		KTANEBanner.alt = 'Banner';
		bannerDiv.appendChild(KTANEBanner);
	}
}

class App {
	static preLoadComponent() {
		Component.loadBanner();
	}

	static main() {
		// Initialize Bomb
		this.bomb = new Bomb();

		// Load Available Module Settings
		Module.loadModulesSettings();

		// Load Initial Display
		document.addEventListener(
			'DOMContentLoaded',

			() => {
				UI.displaySolverStatus('Please input bomb settings', 'lock');
			}
		);

		// Event: Everytime Bomb settings input field change
		DOMCollection.bomb_settings.addEventListener('change', () => {
			if (Logic.bombSettingsValidation(this.bomb)) {
				// Change Input Status to True
				UI.displaySolverStatus('Bomb settings saved', 'unlock');

				// Show Sidebar
				UI.displaySidebar(true);
			} else {
				// Change Input Status to False
				UI.displaySolverStatus('Please input bomb settings', 'lock');

				// Hide Sidebar
				UI.displaySidebar(false);
			}

			// Reset Module
			Module.resetModule();
		});

		// Event: Load Module everytime user click
		DOMCollection.module_items.forEach((module) => {
			module.addEventListener('click', (e) => {
				// e.preventDefault();

				// Load Module
				Module.loadModule(this.bomb, e.target);
			});
		});
	}
}

App.preLoadComponent();
App.main();
