/**
# D2L Table

## Usage
```
	<link rel="import" href="d2l-table.html">
	<d2l-table>
		<d2l-thead>
			<d2l-tr>
				<d2l-th>Table header cell</d2l-th>
			</d2l-tr>
		</d2l-thead>
		<d2l-tfoot>
			<d2l-tr>
				<d2l-th>Table header cell</d2l-th>
			</d2l-tr>
		</d2l-tfoot>
		<d2l-tbody>
			<d2l-tr>
				<d2l-td>Table cell</d2l-td>
			</d2l-tr>
		</d2l-tbody>
	</d2l-table>
```

### Table attributes

Attribute | Description
----------|-------------
`type` | Table style - "default" or "light"

### Row Attributes

Attribute | Description
----------|-------------
`selected` | Apply selected style
`header` | Apply header style

## Styling

Custom property | Description | Default
----------------|-------------|----------
`--d2l-table-border-color` | Border Color | `var(--d2l-color-mica)` |
`--d2l-table-border-radius` | Corner Border Radius | `0.3rem` |
`--d2l-table-border` | Border | `1px solid var(--d2l-table-border-color);` |
`--d2l-table-header-background-color` | Header background color (th elements under `<thead>` or `<tr header>`) | `var(--d2l-color-regolith);` |
`--d2l-table-body-background-color` | Body background color (non-header) | `#fff` |
`--d2l-table-row-border-color-selected` | Selected row border color | `var(--d2l-color-celestine)` |
`--d2l-table-row-background-color-selected` | Selected row background color | `var(--d2l-color-celestine-plus-2)` |
`--d2l-table-border-overflow` | Border to show when the table overflows | `dashed 1px var(--d2l-color-mica)` |

`--d2l-table-light-border-color` | Border color for light style | `var(--d2l-color-gypsum)` |
`--d2l-table-light-border` | Border for light style | `1px solid var(--d2l-table-light-border-color)` |
`--d2l-table-light-header-background-color` | Header background color (th elements under `<thead>` or `<tr header>`) for light style | `#fff` |

```
	<link rel="import" href="d2l-table.html">
	<custom-style>
	<style is="custom-style">
		.ugly-table {
			--d2l-table-border-color: purple
			--d2l-table-border-radius: 0;
			--d2l-table-header-background-color: grey;
			--d2l-table-body-background-color: blue;
			--d2l-table-row-border-color-selected: black;
			--d2l-table-row-background-color-selected: black;
			--d2l-table-border-overflow: none;
		}

	</style>
	</custom-style>
	<d2l-table class="ugly-table">
		<d2l-thead>
			<d2l-tr>
				<d2l-th>Table header cell</d2l-th>
			</d2l-tr>
		</d2l-thead>
		<d2l-tfoot>
			<d2l-tr>
				<d2l-th>Table header cell</d2l-th>
			</d2l-tr>
		</d2l-tfoot>
		<d2l-tbody>
			<d2l-tr>
				<d2l-td>Table cell</d2l-td>
			</d2l-tr>
		</d2l-tbody>
	</d2l-table>
```

@demo demo/index.html	  Table demo
@demo demo/index.rtl.html  RTL Table demo
@demo demo/responsive.html Identical tables with different widths
*/
/*
  FIXME(polymer-modulizer): the above comments were extracted
  from HTML and may be out of place here. Review them and
  then delete this comment!
*/
import '@polymer/polymer/polymer-legacy.js';

import '@brightspace-ui/core/components/colors/colors.js';
import 'fastdom/fastdom.js';
import './d2l-scroll-wrapper.js';
import './d2l-table-col-sort-button.js';
import './d2l-table-observer-behavior.js';
import './d2l-table-style.js';
import './d2l-table-wrapper.js';
import './d2l-tbody.js';
import './d2l-td.js';
import './d2l-tfoot.js';
import './d2l-th.js';
import './d2l-thead.js';
import './d2l-tr.js';
import './d2l-tspan.js';
import { Polymer } from '@polymer/polymer/lib/legacy/polymer-fn.js';
import { afterNextRender } from '@polymer/polymer/lib/utils/render-status.js';
import { dom } from '@polymer/polymer/lib/legacy/polymer.dom.js';
const $_documentContainer = document.createElement('template');

$_documentContainer.innerHTML = `<dom-module id="d2l-table">
	<template strip-whitespace="">
		<style>
			:host {
				background-color: transparent;
				display: block;
				width: 100%;
				--d2l-table-border-color: var(--d2l-color-mica);
				--d2l-table-border: 1px solid var(--d2l-table-border-color);
				--d2l-table-header-background-color: var(--d2l-color-regolith);
				--d2l-table-border-radius: 0.3rem;
				--d2l-table-row-border-color-selected: var(--d2l-color-celestine);
				--d2l-table-row-background-color-selected: var(--d2l-color-celestine-plus-2);
			}
			:host([hidden]) {
				display: none;
			}
			:host([type="light"]) {
				--d2l-table-border-color: var(--d2l-color-gypsum);
				--d2l-table-header-background-color: #ffffff;
			}
			.d2l-table-inner {
				background-color: transparent;
				border-collapse: separate!important;
				border-spacing: 0;
				display: table;
				font-size: 0.8rem;
				font-weight: 400;
				width: 100%;
			}
		</style>
		<d2l-scroll-wrapper show-actions>
			<div class="d2l-table-inner" role="table"><slot id="slot"></slot></div>
		</d2l-scroll-wrapper>
	</template>

</dom-module>`;

document.head.appendChild($_documentContainer.content);
Polymer({
	is: 'd2l-table',
	behaviors: [
		D2L.PolymerBehaviors.Table.LocalObserverBehavior
	],
	listeners: {
		'd2l-table-local-observer': '_handleLocalObserver'
	},
	properties: {
		/*
		* Styling type, possible options are "default" or "light"
		*/
		type: {
			type: String,
			value: 'default',
			reflectToAttribute: true
		}
	},
	__applyInQueue: false,
	attached: function() {
		afterNextRender(this, function() {
			this._applyClassNames();
		}.bind(this));
	},
	notifyResize: function() {
		this.$$('d2l-scroll-wrapper').notifyResize();
	},
	_applyClassNames: function() {

		// don't allow a bunch of calls to queue up
		if (this.__applyInQueue) return;
		this.__applyInQueue = true;

		fastdom.mutate(function() {
			this.__applyInQueue = false;
			var rows = this._getRowsAndCells();
			for (var i = 0; i < rows.length; i++) {
				var row = rows[i];
				if (i === 0) {
					row.elem.classList.add('d2l-table-row-first');
					if (row.elem.tagName === 'D2L-TSPAN') {
						row.elem.$.float.classList.add('d2l-table-row-first');
					}
				} else {
					row.elem.classList.remove('d2l-table-row-first');
					if (row.elem.tagName === 'D2L-TSPAN') {
						row.elem.$.float.classList.remove('d2l-table-row-first');
					}
				}
				if (i === rows.length - 1) {
					row.elem.classList.add('d2l-table-row-last');
					if (row.elem.tagName === 'D2L-TSPAN') {
						row.elem.$.float.classList.add('d2l-table-row-last');
					}
				} else {
					row.elem.classList.remove('d2l-table-row-last');
					if (row.elem.tagName === 'D2L-TSPAN') {
						row.elem.$.float.classList.remove('d2l-table-row-last');
					}
				}
				for (var j = 0; j < row.cells.length; j++) {
					var cell = row.cells[j];
					if (j === 0) {
						cell.classList.add('d2l-table-cell-first');
					} else {
						cell.classList.remove('d2l-table-cell-first');
					}
					if (j === row.cells.length - 1) {
						cell.classList.add('d2l-table-cell-last');
					} else {
						cell.classList.remove('d2l-table-cell-last');
					}
				}
			}
		}.bind(this));

	},
	_handleLocalObserver: function() {
		// descendants have been added/removed from somewhere in
		// the <slot>,so re-calculate
		this._applyClassNames();
	},
	_getRowsAndCells: function() {

		var headerRows = [];
		var bodyRows = [];
		var footerRows = [];

		function recurse(node, rows) {

			var keepGoing = true;
			var childRows = rows;

			if (node.nodeType === 1) {
				var tagName = node.tagName.toLowerCase();
				if (tagName === 'd2l-tr' || tagName === 'd2l-tspan') {
					rows.push({ elem: node, cells: [] });
				} else if (tagName === 'd2l-td' || tagName === 'd2l-th') {
					if (rows.length > 0) {
						rows[rows.length - 1].cells.push(node);
						keepGoing = false;
					}
				} else if (tagName === 'thead' || tagName === 'd2l-thead') {
					childRows = headerRows;
				} else if (tagName === 'tfoot' || tagName === 'd2l-tfoot') {
					childRows = footerRows;
				} else if (tagName === 'tbody' || tagName === 'd2l-tbody') {
					childRows = bodyRows;
				}
			}

			if (!keepGoing) return;

			var children = dom(node).getEffectiveChildNodes();
			for (var i = 0; i < children.length; i++) {
				recurse(children[i], childRows);
			}

		}

		recurse(this.root, bodyRows);

		var rows = headerRows.concat(bodyRows.concat(footerRows));
		return rows;

	}
});
