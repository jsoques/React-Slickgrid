import React, { Component } from 'react';

// import 'jquery';
// import 'jquery-ui/ui/widgets/draggable';
// import 'jquery-ui/ui/widgets/droppable';
// import 'jquery-ui/ui/widgets/sortable';

import {
  BindingEventService,
  Column,
  FieldType,
  Filters,
  Formatters,
  GridOption,
  GridStateChange,
  GridStateType,
  TreeToggledItem,
  TreeToggleStateChange
} from '@slickgrid-universal/common';
import { ExcelExportService } from '@slickgrid-universal/excel-export';
import {
  Slicker,
  SlickVanillaGridBundle
} from '@slickgrid-universal/vanilla-bundle';

import { ExampleGridOptions } from './example-grid-options';
import './example05.scss';

interface Props {}
interface State {}

export default class Grid5 extends Component<Props, State> {
  state = {};

  NB_ITEMS = 500;

  private _bindingEventService: BindingEventService = new BindingEventService();
  columnDefinitions: Column[];
  gridOptions: GridOption;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataset: any[];
  sgb: SlickVanillaGridBundle;
  loadingClass = '';
  isLargeDataset = false;
  hasNoExpandCollapseChanged = true;
  treeToggleItems: TreeToggledItem[] = [];

  hideSpinner() {
    setTimeout(() => (this.loadingClass = ''), 200); // delay the hide spinner a bit to avoid show/hide too quickly
  }

  showSpinner() {
    if (this.isLargeDataset) {
      this.loadingClass = 'mdi mdi-load mdi-spin-1s mdi-24px color-alt-success';
    }
  }

  initializeGrid() {
    this.columnDefinitions = [
      {
        id: 'title',
        name: 'Title',
        field: 'title',
        width: 220,
        cssClass: 'cell-title',
        filterable: true,
        sortable: true,
        exportWithFormatter: false,
        queryFieldSorter: 'id',
        type: FieldType.string,
        formatter: Formatters.tree,
        exportCustomFormatter: Formatters.treeExport
      },
      {
        id: 'duration',
        name: 'Duration',
        field: 'duration',
        minWidth: 90,
        filterable: true
      },
      {
        id: 'percentComplete',
        name: '% Complete',
        field: 'percentComplete',
        minWidth: 120,
        maxWidth: 200,
        exportWithFormatter: false,
        sortable: true,
        filterable: true,
        filter: { model: Filters.compoundSlider, operator: '>=' },
        formatter: Formatters.percentCompleteBarWithText,
        type: FieldType.number
      },
      {
        id: 'start',
        name: 'Start',
        field: 'start',
        minWidth: 60,
        type: FieldType.dateIso,
        filterable: true,
        sortable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso
      },
      {
        id: 'finish',
        name: 'Finish',
        field: 'finish',
        minWidth: 60,
        type: FieldType.dateIso,
        filterable: true,
        sortable: true,
        filter: { model: Filters.compoundDate },
        formatter: Formatters.dateIso
      },
      {
        id: 'effortDriven',
        name: 'Effort Driven',
        width: 80,
        minWidth: 20,
        maxWidth: 80,
        cssClass: 'cell-effort-driven',
        field: 'effortDriven',
        exportWithFormatter: false,
        formatter: Formatters.checkmark,
        cannotTriggerInsert: true,
        filterable: true,
        filter: {
          collection: [
            { value: '', label: '' },
            { value: true, label: 'True' },
            { value: false, label: 'False' }
          ],
          model: Filters.singleSelect
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        container: '.demo-container'
      },
      enableAutoSizeColumns: true,
      enableAutoResize: true,
      enableExcelExport: true,
      exportOptions: { exportWithFormatter: true },
      excelExportOptions: { exportWithFormatter: true },
      registerExternalResources: [new ExcelExportService()],
      enableFiltering: true,
      showCustomFooter: true, // display some metrics in the bottom custom footer
      customFooterOptions: {
        // optionally display some text on the left footer container
        leftFooterText:
          'Grid created with <a href="https://github.com/ghiscoding/slickgrid-universal" target="_blank">Slickgrid-Universal</a> <i class="mdi mdi-github"></i>'
      },
      enableTreeData: true, // you must enable this flag for the filtering & sorting to work as expected
      treeDataOptions: {
        columnId: 'title',
        parentPropName: 'parentId',
        // this is optional, you can define the tree level property name that will be used for the sorting/indentation, internally it will use "__treeLevel"
        levelPropName: 'treeLevel',
        indentMarginLeft: 15,
        initiallyCollapsed: true,

        // you can optionally sort by a different column and/or sort direction
        // this is the recommend approach, unless you are 100% that your original array is already sorted (in most cases it's not)
        initialSort: {
          columnId: 'title',
          direction: 'ASC'
        },
        // we can also add a custom Formatter just for the title text portion
        titleFormatter: (_row, _cell, value, _def, dataContext) => {
          let prefix = '';
          if (dataContext.treeLevel > 0) {
            prefix = `<span class="mdi mdi-subdirectory-arrow-right mdi-v-align-sub color-se-secondary"></span>`;
          }
          return `${prefix}<span class="bold">${value}</span> <span style="font-size:11px; margin-left: 15px;">(parentId: ${dataContext.parentId})</span>`;
        }
      },
      multiColumnSort: false, // multi-column sorting is not supported with Tree Data, so you need to disable it
      presets: {
        filters: [
          { columnId: 'percentComplete', searchTerms: [25], operator: '>=' }
        ]
        // treeData: { toggledItems: [{ itemId: 1, isCollapsed: false }] },
      },
      // if you're dealing with lots of data, it is recommended to use the filter debounce
      filterTypingDebounce: 250
    };
  }

  loadData = (rowCount: number) => {
    this.isLargeDataset = rowCount > 5000; // we'll show a spinner when it's large, else don't show show since it should be fast enough
    let indent = 0;
    const parents = [];
    const data = [];

    // prepare the data
    for (let i = 0; i < rowCount; i++) {
      const randomYear = 2000 + Math.floor(Math.random() * 10);
      const randomMonth = Math.floor(Math.random() * 11);
      const randomDay = Math.floor(Math.random() * 29);
      const item = (data[i] = {});
      let parentId;

      /*
            for demo & E2E testing purposes, let's make "Task 0" empty and then "Task 1" a parent that contains at least "Task 2" and "Task 3" which the latter will also contain "Task 4" (as shown below)
            also for all other rows don't go over indent tree level depth of 2
            Task 0
            Task 1
              Task 2
              Task 3
                Task 4
            ...
           */
      if (i === 1 || i === 0) {
        indent = 0;
        parents.pop();
      }
      if (i === 3) {
        indent = 1;
      } else if (
        i === 2 ||
        i === 4 ||
        (Math.random() > 0.8 &&
          i > 0 &&
          indent < 3 &&
          i - 1 !== 0 &&
          i - 1 !== 2)
      ) {
        // also make sure Task 0, 2 remains empty
        indent++;
        parents.push(i - 1);
      } else if (Math.random() < 0.3 && indent > 0) {
        indent--;
        parents.pop();
      }

      if (parents.length > 0) {
        parentId = parents[parents.length - 1];
      } else {
        parentId = null;
      }

      item['id'] = i;
      item['parentId'] = parentId;
      item['title'] = `Task ${i}`;
      item['duration'] = '5 days';
      item['percentComplete'] = Math.round(Math.random() * 100);
      item['start'] = new Date(randomYear, randomMonth, randomDay);
      item['finish'] = new Date(randomYear, randomMonth + 1, randomDay);
      item['effortDriven'] = i % 5 === 0;
    }
    if (this.sgb) {
      this.sgb.dataset = data;
    }
    return data;
  };

  handleOnTreeFullToggleEnd(e: CustomEvent<TreeToggleStateChange>) {
    const treeToggleExecution = e.detail;
    console.log('Tree Data changes', treeToggleExecution);
    this.hideSpinner();
  }

  /** Whenever a parent is being toggled, we'll keep a reference of all of these changes so that we can reapply them whenever we want */
  handleOnTreeItemToggled(e: CustomEvent<TreeToggleStateChange>) {
    this.hasNoExpandCollapseChanged = false;
    const treeToggleExecution = e.detail;
    this.treeToggleItems = treeToggleExecution.toggledItems;
    console.log('Tree Data changes', treeToggleExecution);
  }

  handleOnGridStateChanged(e: CustomEvent<GridStateChange>) {
    this.hasNoExpandCollapseChanged = false;
    const gridStateChange = e.detail;

    if (gridStateChange.change.type === GridStateType.treeData) {
      console.log(
        'Tree Data gridStateChange',
        gridStateChange.gridState.treeData
      );
      this.treeToggleItems = gridStateChange.gridState.treeData.toggledItems;
    }
  }

  dynamicallyChangeFilter = () => {
    this.sgb.filterService.updateFilters([
      { columnId: 'percentComplete', operator: '<', searchTerms: [40] }
    ]);
  };

  collapseAllWithoutEvent = () => {
    this.sgb.treeDataService.toggleTreeDataCollapse(true, false);
  };

  dynamicallyToggledFirstParent = () => {
    const parentPropName = 'parentId';
    const treeLevelPropName = 'treeLevel'; // if undefined in your options, the default prop name is "__treeLevel"
    const newTreeLevel = 1;

    // find first parent object and toggle it
    const childItemFound = this.sgb.dataset.find(
      (item) => item[treeLevelPropName] === newTreeLevel
    );
    const parentItemFound = this.sgb.dataView.getItemByIdx(
      childItemFound[parentPropName]
    );

    if (childItemFound && parentItemFound) {
      this.sgb.treeDataService.dynamicallyToggleItemState([
        {
          itemId: parentItemFound.id,
          isCollapsed: !parentItemFound.__collapsed
        }
      ]);
    }
  };

  reapplyToggledItems = () => {
    this.sgb.treeDataService.applyToggledItemStateChanges(this.treeToggleItems);
  };

  /**
   * A simple method to add a new item inside the first group that we find (it's random and is only for demo purposes).
   * After adding the item, it will sort by parent/child recursively
   */
  addNewRow = () => {
    const newId = this.sgb.dataset.length;
    const parentPropName = 'parentId';
    const treeLevelPropName = 'treeLevel'; // if undefined in your options, the default prop name is "__treeLevel"
    const newTreeLevel = 1;
    // find first parent object and add the new item as a child
    const childItemFound = this.sgb.dataset.find(
      (item) => item[treeLevelPropName] === newTreeLevel
    );
    const parentItemFound = this.sgb.dataView.getItemByIdx(
      childItemFound[parentPropName]
    );

    if (childItemFound && parentItemFound) {
      const newItem = {
        id: newId,
        parentId: parentItemFound.id,
        title: `Task ${newId}`,
        duration: '1 day',
        percentComplete: 99,
        start: new Date(),
        finish: new Date(),
        effortDriven: false
      };

      // use the Grid Service to insert the item,
      // it will also internally take care of updating & resorting the hierarchical dataset
      this.sgb.gridService.addItem(newItem);
    }
  };

  collapseAll = () => {
    this.sgb.treeDataService.toggleTreeDataCollapse(true);
  };

  expandAll = () => {
    this.sgb.treeDataService.toggleTreeDataCollapse(false);
  };

  logTreeDataToggledItems = () => {
    console.log(this.sgb.treeDataService.getToggledItems());
  };

  logFlatStructure = () => {
    console.log('flat array', this.sgb.treeDataService.dataset);
  };

  logHierarchicalStructure = () => {
    console.log(
      'hierarchical array',
      this.sgb.treeDataService.datasetHierarchical
    );
  };

  componentDidMount() {
    this.initializeGrid();
    this.dataset = [];
    const gridContainerElm = document.querySelector<HTMLDivElement>('.grid5');

    this.sgb = new Slicker.GridBundle(
      gridContainerElm,
      this.columnDefinitions,
      {
        ...ExampleGridOptions,
        ...this.gridOptions
      }
    );
    this.dataset = this.loadData(this.NB_ITEMS);

    // optionally display only the parent items count on the right footer
    // this.sgb.slickFooter.rightFooterText = `${this.sgb.treeDataService.getItemCount(0)} parent items`;

    // with large dataset you maybe want to show spinner before/after these events: sorting/filtering/collapsing/expanding
    this._bindingEventService.bind(
      gridContainerElm,
      'onbeforefilterchange',
      this.showSpinner.bind(this)
    );
    this._bindingEventService.bind(
      gridContainerElm,
      'onfilterchanged',
      this.hideSpinner.bind(this)
    );
    this._bindingEventService.bind(
      gridContainerElm,
      'onbeforefilterclear',
      this.showSpinner.bind(this)
    );
    this._bindingEventService.bind(
      gridContainerElm,
      'onfiltercleared',
      this.hideSpinner.bind(this)
    );
    this._bindingEventService.bind(
      gridContainerElm,
      'onbeforesortchange',
      this.showSpinner.bind(this)
    );
    this._bindingEventService.bind(
      gridContainerElm,
      'onsortchanged',
      this.hideSpinner.bind(this)
    );

    // keep toggled items, note that we could also get these changes via the `onGridStateChanged`
    this._bindingEventService.bind(
      gridContainerElm,
      'ontreefulltogglestart',
      this.showSpinner.bind(this)
    );
    this._bindingEventService.bind(
      gridContainerElm,
      'ontreefulltoggleend',
      this.handleOnTreeFullToggleEnd.bind(this)
    );
    this._bindingEventService.bind(
      gridContainerElm,
      'ontreeitemtoggled',
      this.handleOnTreeItemToggled.bind(this)
    );
    // or use the Grid State change event
    // this._bindingEventService.bind(gridContainerElm, 'ongridstatechanged', this.handleOnGridStateChanged.bind(this));
  }

  componentWillUnmount() {
    this.sgb?.dispose();
  }

  render() {
    return (
      <div>
        <h3 className="gridtitle is-3">
          Example 05 - Tree Data
          <span className="subtitle">
            (from a flat dataset with <code>parentId</code> references)
          </span>
        </h3>
        <h6 className="title is-6 italic">
          NOTE: The grid will automatically sort Ascending with the column that
          has the Tree Data, you could add a "sortByFieldId" in your column
          "treeData" option if you wish to sort on a different column
        </h6>
        <div className="columns">
          <div className="column is-narrow">
            <div className="row" style={{ marginBottom: '4px' }}>
              <button
                className="button is-small"
                data-test="add-500-rows-btn"
                onClick={() => {
                  this.loadData(500);
                }}
              >
                500 rows
              </button>
              <button
                className="button is-small"
                data-test="add-50k-rows-btn"
                onClick={() => {
                  this.loadData(25000);
                }}
              >
                25k rows
              </button>
              <button
                className="button is-small"
                data-test="change-filter-dynamically"
                onClick={() => {
                  this.dynamicallyChangeFilter();
                }}
              >
                <span className="icon mdi mdi-filter-outline"></span>
                <span>Dynamically Change Filter (% complete &lt; 40)</span>
              </button>
              <button
                data-test="collapse-all-noevent-btn"
                className="button is-small"
                onClick={() => {
                  this.collapseAllWithoutEvent();
                }}
              >
                <span className="icon mdi mdi-arrow-collapse"></span>
                <span>Collapse All (without triggering event)</span>
              </button>
              <button
                data-test="dynamically-toggle-first-parent-btn"
                className="button is-small"
                onClick={() => {
                  this.dynamicallyToggledFirstParent();
                }}
              >
                <span>Dynamically Toggle First Parent</span>
              </button>
              <button
                data-test="reapply-toggled-items-btn"
                className="button is-small"
                onClick={() => {
                  this.reapplyToggledItems();
                }}
                disabled
              >
                <span className="icon mdi mdi-history"></span>
                <span>Reapply Previous Toggled Items</span>
              </button>
            </div>
            <div className="row" style={{ marginBottom: '4px' }}>
              <button
                data-test="add-item-btn"
                className="button is-small is-info"
                onClick={() => {
                  this.addNewRow();
                }}
              >
                <span className="icon mdi mdi-plus"></span>
                <span>Add New Item (in 1st group)</span>
              </button>
              <button
                data-test="collapse-all-btn"
                className="button is-small"
                onClick={() => {
                  this.collapseAll();
                }}
              >
                <span className="icon mdi mdi-arrow-collapse"></span>
                <span>Collapse All</span>
              </button>
              <button
                data-test="expand-all-btn"
                className="button is-small"
                onClick={() => {
                  this.expandAll();
                }}
              >
                <span className="icon mdi mdi-arrow-expand"></span>
                <span>Expand All</span>
              </button>
              <button
                className="button is-small"
                onClick={() => {
                  this.logTreeDataToggledItems();
                }}
              >
                <span>Log Tree Toggled Items</span>
              </button>
              <button
                className="button is-small"
                onClick={() => {
                  this.logFlatStructure();
                }}
              >
                <span>Log Flat Structure</span>
              </button>
              <button
                className="button is-small"
                onClick={() => {
                  this.logHierarchicalStructure();
                }}
              >
                <span>Log Hierarchical Structure</span>
              </button>
            </div>
          </div>
        </div>
        <div className="grid5"></div>
      </div>
    );
  }
}
