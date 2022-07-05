/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 893:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ 555:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HierarchyManager = void 0;
const StateManager_1 = __webpack_require__(498);
class HierarchyManager {
    constructor() {
        this.stateManager = new StateManager_1.StateManager();
        this.titleSelector = '.js-category-title';
        this.titleOpenedClass = 'category__title--open';
        this.listSelector = '.js-category-list';
    }
    /**
     * Инициализирует иерархию.
     */
    init() {
        this.addListeners();
        this.initSaved();
        this.openCurrentPath();
    }
    openPathAndSave(id) {
        this.openPath(id);
        this.stateManager.addOpenedPath(id);
    }
    openPath(id) {
        var _a, _b;
        const list = document.querySelector(`${this.listSelector}[data-id="${id}"]`);
        if (!list) {
            return;
        }
        list.classList.add('_open');
        (_b = (_a = list.parentNode) === null || _a === void 0 ? void 0 : _a.querySelector(this.titleSelector)) === null || _b === void 0 ? void 0 : _b.classList.add(this.titleOpenedClass);
    }
    closePath(id) {
        var _a, _b;
        const list = document.querySelector(`${this.listSelector}[data-id="${id}"]`);
        if (!list) {
            return;
        }
        list.classList.remove('_open');
        (_b = (_a = list.parentNode) === null || _a === void 0 ? void 0 : _a.querySelector(this.titleSelector)) === null || _b === void 0 ? void 0 : _b.classList.remove(this.titleOpenedClass);
        this.stateManager.removeOpenedPath(id);
    }
    closePathWithChildren(id) {
        this.closePath(id);
        const list = document.querySelector(`${this.listSelector}[data-id="${id}"]`);
        if (!list) {
            return;
        }
        const childLists = list.querySelectorAll(this.listSelector);
        for (const item of childLists) {
            this.closePath(item.dataset.id || '');
        }
    }
    togglePath(id) {
        const list = document.querySelector(`${this.listSelector}[data-id="${id}"]`);
        if (!list) {
            return;
        }
        if (list.classList.contains('_open')) {
            this.closePathWithChildren(id);
            return;
        }
        this.openPathAndSave(id);
    }
    addListeners() {
        const items = document.querySelectorAll('.js-category-title:not([data-id="root"])');
        for (const item of items) {
            item.addEventListener('click', () => {
                const id = item.dataset.id || '';
                this.togglePath(id);
            });
        }
        this.addExpandListener();
        this.addCollapseListener();
        this.addTargetListener();
    }
    addExpandListener() {
        const expandButton = document.querySelector('.js-tree-expand');
        expandButton === null || expandButton === void 0 ? void 0 : expandButton.addEventListener('click', () => {
            const items = document.querySelectorAll(this.listSelector);
            for (const item of items) {
                const id = item.dataset.id || '';
                this.openPathAndSave(id);
            }
        });
    }
    addCollapseListener() {
        const collapseButton = document.querySelector('.js-tree-collapse');
        collapseButton === null || collapseButton === void 0 ? void 0 : collapseButton.addEventListener('click', () => {
            const items = document.querySelectorAll(this.listSelector);
            for (const item of items) {
                const id = item.dataset.id || '';
                this.closePath(id);
            }
        });
    }
    addTargetListener() {
        const targetButton = document.querySelector('.js-tree-target');
        targetButton === null || targetButton === void 0 ? void 0 : targetButton.addEventListener('click', () => {
            const targetElement = this.openCurrentPath();
            targetElement === null || targetElement === void 0 ? void 0 : targetElement.scrollIntoView();
        });
    }
    initSaved() {
        const savedPaths = this.stateManager.getOpenedPaths();
        for (const id of savedPaths) {
            this.openPath(id);
        }
    }
    openCurrentPath() {
        const pathname = window.location.pathname.replace('/docs', '');
        const activeElement = document.querySelector(`.js-category-link[data-id="${pathname}"]`);
        if (!activeElement) {
            return null;
        }
        activeElement.classList.add('_active');
        let parent = activeElement.closest(this.listSelector);
        // eslint-disable-next-line no-constant-condition,@typescript-eslint/no-unnecessary-condition
        while (true) {
            if (!parent) {
                break;
            }
            const id = parent.dataset.id || '';
            this.openPath(id);
            parent = parent.parentNode.closest(this.listSelector);
        }
        return activeElement;
    }
}
exports.HierarchyManager = HierarchyManager;


/***/ }),

/***/ 498:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StateManager = void 0;
class StateManager {
    constructor() {
        this.openedPathLsKey = 'opened-path-state';
        this.openedPaths = [];
        const lsOpenedPathState = localStorage.getItem('opened-path-state');
        this.openedPaths = lsOpenedPathState
            ? JSON.parse(lsOpenedPathState)
            : [];
    }
    /**
     * Добавляет path в стейт.
     */
    addOpenedPath(path) {
        this.openedPaths.push(path);
        this.updateState();
    }
    /**
     * Удаляет path из стейта.
     */
    removeOpenedPath(path) {
        this.openedPaths = this.openedPaths.filter((savedPath) => savedPath !== path);
        this.updateState();
    }
    /**
     * Получает все открытые paths.
     */
    getOpenedPaths() {
        return this.openedPaths;
    }
    updateState() {
        localStorage.setItem(this.openedPathLsKey, JSON.stringify(this.openedPaths));
    }
}
exports.StateManager = StateManager;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
var __webpack_unused_export__;

__webpack_unused_export__ = ({ value: true });
__webpack_require__(893);
const HierarchyManager_1 = __webpack_require__(555);
const hierarchyManager = new HierarchyManager_1.HierarchyManager();
hierarchyManager.init();

})();

/******/ })()
;